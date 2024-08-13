import datetime
import hashlib
import json
import math
import os.path
import random
import secrets
import subprocess
import time
from io import BytesIO
from pathlib import Path
import pypdfium2 as pdfium

import boto3
import requests
from django.core.files.storage import default_storage
from django.db.models import Q
import docxtpl
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from . import models
from twilio.rest import Client
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent

# variables
# Twilio
client = Client('AC6021b61b22679477b2f03267b595d77a', '4187336a6343cfecc0ce12f9b23d0ecc')

s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                         aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)


# Token generation
def generatetoken():
    token = secrets.token_hex(20)
    if models.TokenTable.objects.filter(token=token):
        generatetoken()
    return str(token)


def generateotp():
    digits = '01234656789'
    otp = ''
    for i in range(6):
        otp += digits[math.floor(random.random() * 10)]
    return otp


def generatecardnumber():
    number = 'RH'
    digits = '01234656789'
    for i in range(10):
        number += digits[math.floor(random.random() * 10)]
    if models.HealthcardTable.objects.filter(healthcard_number=number):
        generatecardnumber()
    return number


def encode_password(password):
    password_bytes = password.encode('utf-8')
    sha256_hash = hashlib.sha256()
    sha256_hash.update(password_bytes)
    hashed_password = sha256_hash.hexdigest()
    return hashed_password


class verifytoken(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            token = models.TokenTable.objects.filter(token=token)
            if token and token[0].expiry_date != datetime.date.today():
                return Response({"status": "verified"})
        return Response({"status": "invalid token"})


class LoginView(APIView):

    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        mobile_number = r.data['mobile_number']
        userdata = models.UsersTable.objects.filter(mobile_number=mobile_number)
        if userdata:
            token = models.TokenTable.objects.filter(mobile_number=mobile_number)
            if token:
                if token[0].expiry_date == datetime.date.today():
                    tokengenerated = generatetoken()
                    token[0].token = tokengenerated
                    token[0].expiry_date = datetime.date.today() + datetime.timedelta(days=3)
                    token[0].save()
                    return Response(data={"token": tokengenerated, "status": "token success"},
                                    )
                else:
                    return Response(data={'token': token[0].token, "status": "token success"},
                                    )
            else:
                newtoken = models.TokenTable(token=generatetoken(), mobile_number=mobile_number,
                                             expiry_date=datetime.date.today() + datetime.timedelta(days=3))
                newtoken.save()
                return Response(data={"token": newtoken.token, "status": "token success"},
                                )
        return Response(data={"status": 'usernotfound'})


class SignupView(APIView):

    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        mobile_number = r.data['mobile_number']
        fullname = r.data['fullname']
        userdata = models.UsersTable.objects.filter(mobile_number=mobile_number)
        if userdata:
            return Response({'status': "Already exists"})
        else:
            models.UsersTable.objects.create(mobile_number=mobile_number, fullname=fullname)
            token = models.TokenTable.objects.create(token=generatetoken(), mobile_number=mobile_number,
                                                     expiry_date=datetime.date.today() + datetime.timedelta(days=3))
            msg = client.messages.create(to='whatsapp:+91' + mobile_number,
                                         content_sid='HXca2dfaa56a873643d324681660772331',
                                         from_='MG4218283054ac18e84afb01283f9637b6')
            return Response(data={"token": token.token, "status": "token success"})


class OTPview(APIView):

    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        mobile_number = r.data['mobile_number']
        otp = generateotp()
        msg = client.messages.create(
            messaging_service_sid='MG1c0cf14211e878b3ad15d24e4ed9a83d',
            body='''OTP to verify mobile number is %s\nFrom DR.RADHIKA MULTI SPECIALITY HOSPITAL AND FERTILITY CENTER
            ''' % otp,
            to="+91" + mobile_number,
            from_='+14159428465'
        )
        time.sleep(2)
        print(msg.fetch().status)
        if msg.fetch().status == 'sent' or msg.fetch().status == 'delivered':
            return Response({'otp': otp, 'status': 'sent'})
        return Response({'status': 'notsent'})


def generatecard(cardnumber):
    data = models.HealthcardTable.objects.filter(healthcard_number=cardnumber)
    if data:
        carddata = {"card_number": data[0].healthcard_number, "number": data[0].mobile_number,
                    "name": data[0].name, "gender": data[0].gender, "dob": data[0].dob,
                    "mailid": data[0].mailid,
                    "address": data[0].address, "insurance": data[0].insurance}
        res = requests.get(data[0].profile_img)
        image = Image.open(BytesIO(res.content))
        aspect_ratio = image.width / image.height
        width, height = 1.0, 1.0 / aspect_ratio
        resized_image = image.resize((int(width * 100), int(height * 100)), )
        if resized_image.mode == 'RGBA':
            resized_image = resized_image.convert('RGB')
        image_byte_array = BytesIO()
        resized_image.save(image_byte_array, 'JPEG')
        image_byte_array.seek(0)
        doc = docxtpl.DocxTemplate(os.path.join(BASE_DIR, 'tempaltes/Healthcard_temp.docx'))
        carddata['photo'] = docxtpl.InlineImage(doc, image_byte_array)
        doc.render(carddata)
        buffer = BytesIO()
        key = f'docx/{cardnumber}.docx'
        doc.save(os.path.join(BASE_DIR, key))
        # buffer.seek(0)
        subprocess.run(['libreoffice', '--headless', '--convert-to', 'pdf', os.path.join(BASE_DIR, key), '--outdir',
                        os.path.join(BASE_DIR, 'pdf')])
        pdf_file_path = os.path.join(BASE_DIR, f'pdf/{cardnumber}.pdf')
        pdf = pdfium.PdfDocument(pdf_file_path)
        page = pdf.get_page(0)
        bitmap = page.render(scale=300 / 72)
        image_name = f"card_images/{cardnumber}.jpg"
        pil_image = bitmap.to_pil()
        pil_image.save(image_name)
        with open(os.path.join(BASE_DIR, image_name), 'rb') as image_data:
            default_storage.save(image_name, image_data)
        # s3_client.upload_fileobj(os.path.join(BASE_DIR,image_name), settings.AWS_STORAGE_BUCKET_NAME, image_name)
        file_url = f'https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{image_name}'
        s3_client.put_object_acl(
            ACL='public-read',
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=image_name
        )
        if models.Healthcarddoc.objects.filter(healthcard_number=cardnumber):
            healthdoc = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)[0]
            healthdoc.doc_url = file_url
            healthdoc.save()
        else:
            models.Healthcarddoc.objects.create(healthcard_number=cardnumber, doc_url=file_url)
        client.messages.create(
            to="whatsapp:+91" + data[0].mobile_number,
            content_sid='HX010dab2459bc9a15424bbb40e12364e7',

            content_variables=json.dumps(
                {
                    1: cardnumber + ".jpg",
                    2:cardnumber,
                    3:data[0].name
                }
            ),
            from_='MG4218283054ac18e84afb01283f9637b6'
        )
    else:
        print("error")


class SendCard(APIView):
    def post(self, r):
        card_number = r.data['card_number']
        data = models.HealthcardTable.objects.filter(healthcard_number=card_number)
        carddocurl = models.Healthcarddoc.objects.filter(healthcard_number=card_number)
        msg = client.messages.create(
            to="whatsapp:+91" + data[0].mobile_number,
            content_sid='HX010dab2459bc9a15424bbb40e12364e7',

            content_variables=json.dumps(
                {
                    1: data[0].healthcard_number + ".jpg",
                    2: data[0].healthcard_number,
                    3: data[0].name
                }
            ),
            from_='MG4218283054ac18e84afb01283f9637b6'
        )
        print(msg.fetch().status)
        return Response({"status": "sent"})


class Cardslist(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.TokenTable.objects.filter(token=token)
            if userdata:
                cards_data = models.HealthcardTable.objects.filter(user_mobile_number=userdata[0].mobile_number)
                cards_list = []
                for data in cards_data:
                    cards_list.append(
                        {'card_number': data.healthcard_number, "mobile_number": data.mobile_number, 'name': data.name,
                         'gender': data.gender, 'dob': data.dob, 'mailid': data.mailid, 'address': data.address,
                         'insurance': data.insurance, 'profile_img': data.profile_img})
                return Response(data={"data": cards_list, "status": "data sent"})
        return Response(data={"status": "invalid token"})


class CardView(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        token = r.data['token']
        card_number = r.data['card_number']
        if token != '':
            userdata = models.TokenTable.objects.filter(token=token)
            if userdata:
                carddata = models.HealthcardTable.objects.filter(user_mobile_number=userdata[0].mobile_number,
                                                                 healthcard_number=card_number)
                if carddata:
                    carddata = {'card_number': carddata[0].healthcard_number,
                                'mobile_number': carddata[0].mobile_number,
                                'name': carddata[0].name, 'gender': carddata[0].gender, "dob": carddata[0].dob,
                                "mailid": carddata[0].mailid, "address": carddata[0].address,
                                "insurance": carddata[0].insurance, 'profile_img': carddata[0].profile_img}
                    return Response(data={"data": carddata,
                                          "status": "data sent"})
                return Response({"status": "invalid token"})
            return Response({"status": "no data found"})
        return Response({"status": "invalid token"})


class AddCard(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    #
    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.TokenTable.objects.filter(token=token)
            if userdata:
                profile_img = r.FILES['profile_img']
                key = f'profile-img/{profile_img.name}'
                # profile_img_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{key}"
                # s3_client.upload_fileobj()
                profile_img_name = default_storage.save(key, profile_img)
                profile_img_url = default_storage.url(profile_img_name)
                s3_client.put_object_acl(ACL='public-read', Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
                data = models.HealthcardTable.objects.create(healthcard_number=generatecardnumber(),
                                                             mobile_number=r.data['mobile_number'],
                                                             name=r.data['name'],
                                                             gender=r.data['gender'], dob=r.data['dob'],
                                                             mailid=r.data['mailid'], address=r.data['address'],
                                                             insurance=r.data['insurance'],
                                                             user_mobile_number=userdata[0].mobile_number,
                                                             profile_img=profile_img_url)
                carddata = {"card_number": data.healthcard_number}
                generatecard(data.healthcard_number)
                return Response({"data": carddata, "status": "card added"})
        return Response({"status": "invalid token"})


class DeleteCard(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.TokenTable.objects.filter(token=token)
            if userdata:
                cardnumber = r.data['card_number']
                data = models.HealthcardTable.objects.filter(healthcard_number=cardnumber,
                                                             user_mobile_number=userdata[0].mobile_number)
                if data:
                    data.delete()
                    data1 = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)
                    data1.delete()
                    key = f'docx/{cardnumber}.docx'
                    s3_client.delete_objects(Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                                             Delete={'Objects': [{'Key': key}]})
                    return Response({"status": "card deleted"})
        return Response({"status": "invalid token"})


class DownlaodCard(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        token = r.data.get('token')
        if token != '':
            userdata = models.TokenTable.objects.filter(token=token)
            if userdata:
                cardnumber = r.data['card_number']
                carddocurl = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)
                if carddocurl:
                    return Response({"url": carddocurl[0].doc_url, 'status': 'uploaded'})
                else:
                    generatecard(cardnumber)
                    carddocurl = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)
                    return Response({"url": carddocurl[0].doc_url, 'status': 'uploaded'})
        return Response({"status": "invalid token"})


class Profile(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        token = r.data['token']
        if token != '':
            if r.data['access_type'] == 'read':
                userdata = models.TokenTable.objects.filter(token=token)
                if userdata:
                    profiledata = models.UsersTable.objects.filter(mobile_number=userdata[0].mobile_number)
                    return Response(
                        {"data": {"mobile_number": profiledata[0].mobile_number, "fullname": profiledata[0].fullname},
                         "status": "sent"})
            elif r.data['access_type'] == 'update':
                userdata = models.TokenTable.objects.filter(token=token)
                if userdata:
                    profiledata = models.UsersTable.objects.get(mobile_number=userdata[0].mobile_number)
                    profiledata.fullname = r.data['fullname']
                    profiledata.save()
                    return Response({"status": "updated"})
        return Response({"status": "invalid token"})


class UpdateCard(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        token = r.data['token']
        card_number = r.data['card_number']
        if token != '':
            userdata = models.TokenTable.objects.filter(token=token)
            if userdata:
                carddata = models.HealthcardTable.objects.filter(user_mobile_number=userdata[0].mobile_number,
                                                                 healthcard_number=card_number)
                if carddata:
                    data = models.HealthcardTable.objects.get(user_mobile_number=userdata[0].mobile_number,
                                                              healthcard_number=card_number)
                    data.mobile_number = r.data['mobile_number']
                    data.name = r.data['name']
                    data.gender = r.data['gender']
                    data.dob = r.data['dob']
                    data.mailid = r.data['mailid']
                    data.address = r.data['address']
                    data.insurance = r.data['insurance']
                    # data.profile_img = r.data['profile_img']
                    data.save()
                    generatecard(card_number)
                    return Response({"status": "updated", })
            return Response({"status": "invalid card number"})
        return Response({"status": "invalid token"})


######## ADMIN ##############

class AdminLogin(APIView):
    def get(self, r):
        return Response({'status': "Get Method not allowed"})

    def post(self, r):
        username = r.data['username']
        password = r.data['password']
        if username != '' and password != '':
            # password = encode_password(password)
            userdata = models.AdminTable.objects.filter(username=username)
            if userdata and userdata[0].password == password:
                token = models.AdminToken_Table.objects.filter(username=username)
                if token:
                    if token[0].expiry_date == datetime.date.today():
                        tokengenerated = generatetoken()
                        token[0].token = tokengenerated
                        token[0].expiry_date = datetime.date.today() + datetime.timedelta(days=3)
                        token[0].save()
                        return Response(data={"token": tokengenerated, "status": "token success"},
                                        )
                    else:
                        return Response(data={'token': token[0].token, "status": "token success"},
                                        )
                else:
                    newtoken = models.AdminToken_Table(token=generatetoken(), username=username,
                                                       expiry_date=datetime.date.today() + datetime.timedelta(days=3))
                    newtoken.save()
                    return Response(data={"token": newtoken.token, "status": "token success"},
                                    )
        return Response(data={"status": 'invalid'})


class Admin_Cardslist(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                cards_data = models.HealthcardTable.objects.all()
                cards_list = []
                for data in cards_data:
                    cards_list.append(
                        {'card_number': data.healthcard_number, "mobile_number": data.mobile_number, 'name': data.name,
                         'gender': data.gender, 'dob': data.dob, 'mailid': data.mailid, 'address': data.address,
                         'insurance': data.insurance, 'profile_img': data.profile_img})
                return Response(data={"data": cards_list, "status": "data sent"})
        return Response(data={"status": "invalid token"})


class Admin_ViewCard(APIView):
    def post(self, r):
        token = r.data['token']
        card_number = r.data['card_number']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                carddata = models.HealthcardTable.objects.filter(healthcard_number=card_number)
                if carddata:
                    carddata = {'card_number': carddata[0].healthcard_number,
                                'mobile_number': carddata[0].mobile_number,
                                'name': carddata[0].name, 'gender': carddata[0].gender, "dob": carddata[0].dob,
                                "mailid": carddata[0].mailid, "address": carddata[0].address,
                                "insurance": carddata[0].insurance, 'profile_img': carddata[0].profile_img}
                    return Response(data={"data": carddata,
                                          "status": "data sent"})
            return Response({"status": "no data found"})
        return Response({"status": "invalid token"})


class Admin_AddCard(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            admindata = models.AdminToken_Table.objects.filter(token=token)
            if admindata:
                if models.UsersTable.objects.filter(mobile_number=r.data['mobile_number']):
                    user_mobile_number = models.UsersTable.objects.filter(mobile_number=r.data['mobile_number'])[
                        0].mobile_number
                    profile_img = r.FILES['profile_img']
                    key = f'profile-img/{profile_img.name}'
                    profile_img_name = default_storage.save(key, profile_img)
                    profile_img_url = default_storage.url(profile_img_name)
                    s3_client.put_object_acl(ACL='public-read', Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
                    data = models.HealthcardTable.objects.create(healthcard_number=generatecardnumber(),
                                                                 mobile_number=r.data['mobile_number'],
                                                                 name=r.data['name'],
                                                                 gender=r.data['gender'], dob=r.data['dob'],
                                                                 mailid=r.data['mailid'], address=r.data['address'],
                                                                 insurance=r.data['insurance'],
                                                                 user_mobile_number=user_mobile_number,
                                                                 profile_img=profile_img_url)
                    generatecard(data.healthcard_number)
                    return Response({"data": data.healthcard_number, "status": "card added"})
                else:
                    profile_img = r.FILES['profile_img']
                    key = f'profile-img/{profile_img.name}'
                    profile_img_name = default_storage.save(key, profile_img)
                    profile_img_url = default_storage.url(profile_img_name)
                    s3_client.put_object_acl(ACL='public-read', Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
                    data = models.HealthcardTable.objects.create(healthcard_number=generatecardnumber(),
                                                                 mobile_number=r.data['mobile_number'],
                                                                 name=r.data['name'],
                                                                 gender=r.data['gender'], dob=r.data['dob'],
                                                                 mailid=r.data['mailid'], address=r.data['address'],
                                                                 insurance=r.data['insurance'],
                                                                 user_mobile_number=r.data['mobile_number'],
                                                                 profile_img=profile_img_url)
                    generatecard(data.healthcard_number)
                    return Response({"data": data.healthcard_number, "status": "card added"})
        return Response({"status": "invalid token"})


class Admin_UpdateCard(APIView):

    def post(self, r):
        token = r.data['token']
        card_number = r.data['card_number']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                carddata = models.HealthcardTable.objects.filter(healthcard_number=card_number)
                if carddata:
                    data = models.HealthcardTable.objects.get(healthcard_number=card_number)
                    data.mobile_number = r.data['mobile_number']
                    data.name = r.data['name']
                    data.gender = r.data['gender']
                    data.dob = r.data['dob']
                    data.mailid = r.data['mailid']
                    data.address = r.data['address']
                    data.insurance = r.data['insurance']
                    data.profile_img = r.data['profile_img']
                    data.save()
                    generatecard(card_number)
                    return Response({"status": "updated", })
            return Response({"status": "invalid card number"})
        return Response({"status": "invalid token"})


class Admin_DeleteCard(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                cardnumber = r.data['card_number']
                data = models.HealthcardTable.objects.filter(healthcard_number=cardnumber)
                if data:
                    data.delete()
                    data1 = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)
                    data1.delete()
                    key = f'docx/{cardnumber}.docx'
                    s3_client.delete_objects(Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                                             Delete={'Objects': [{'Key': key}]})
                    return Response({"status": "card deleted"})
        return Response({"status": "invalid token"})


class Admin_SearchCard(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                search = r.data['search']
                data = models.HealthcardTable.objects.filter(
                    Q(healthcard_number__icontains=search) | Q(mobile_number__icontains=search) |
                    Q(name__icontains=search))
                carddata = []
                for i in data:
                    carddata.append({'card_number': i.healthcard_number,
                                     'mobile_number': i.mobile_number,
                                     'name': i.name, 'gender': i.gender, "dob": i.dob,
                                     "mailid": i.mailid, "address": i.address,
                                     "insurance": i.insurance, 'profile_img': i.profile_img})
                return Response({"data": carddata, "status": "found"})
        return Response({"status": "invalid token"})


class Admin_VerifyCard(APIView):

    def post(self, r):
        card_number = r.data['card_number']
        name = r.data['name']
        token = r.data['token']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                if models.HealthcardTable.objects.filter(healthcard_number=card_number, name=name):
                    return Response({"status": "verified"})
                return Response({"status": "not found"})

        return Response({"status": "invalid token"})


class Admin_DownloadCard(APIView):
    def post(self, r):
        token = r.data.get('token')
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                cardnumber = r.data['card_number']
                carddocurl = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)
                if carddocurl:
                    return Response({"url": carddocurl[0].doc_url, 'status': 'uploaded'})
                else:
                    generatecard(cardnumber)
                    carddocurl = models.Healthcarddoc.objects.filter(healthcard_number=cardnumber)
                    return Response({"url": carddocurl[0].doc_url, 'status': 'uploaded'})
        return Response({"status": "invalid token"})


class Admin_UsersList(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            userdata = models.AdminToken_Table.objects.filter(token=token)
            if userdata:
                userlist = models.AdminTable.objects.all()
                users = []
                for user in userlist:
                    users.append({"username": user.username, "fullname": user.fullname, "role": user.role})
                return Response({"data": user, 'status': "sent"})
        return Response({"status": "invalid token"})


class Admin_Profile(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            if r.data['access_type'] == 'read':
                userdata = models.AdminToken_Table.objects.filter(token=token)
                if userdata:
                    profiledata = models.AdminTable.objects.filter(username=userdata[0].username)
                    return Response(
                        {"data": {"username": profiledata[0].username, "fullname": profiledata[0].fullname,
                                  "password": profiledata[0].password},
                         "status": "sent"})
            elif r.data['access_type'] == 'update':
                userdata = models.AdminToken_Table.objects.filter(token=token)
                if userdata:
                    profiledata = models.AdminTable.objects.get(username=userdata[0].username)
                    profiledata.fullname = r.data['fullname']
                    profiledata.password = r.data['password']
                    profiledata.save()
                    return Response({"status": "updated"})
        return Response({"status": "invalid token"})


class Admin_Verifytoken(APIView):
    def post(self, r):
        token = r.data['token']
        if token != '':
            token = models.AdminToken_Table.objects.filter(token=token)
            if token and token[0].expiry_date != datetime.date.today():
                return Response({"status": "verified"})
        return Response({"status": "invalid token"})
