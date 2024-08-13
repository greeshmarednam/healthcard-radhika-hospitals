# # import time
# #
# # from twilio.rest import Client
# #
# # sid= 'ACb1fa9518db00fef21552af1a92681d91'
# # token = '8f832682532b442941f601e5709b1edf'
# #
# # client = Client(sid,token)
# # msg = client.messages.create(
# #     body="Hello otp is 123456",
# #     from_='+15752682723',
# #  to='+919951264256'
# # )
# # time.sleep((5))
# # print(msg.fetch().status)
# import secrets
#
# token = secrets.token_hex(10)
# print(token)

import hashlib

def encode_password(password):
    # Convert the password string to bytes
    password_bytes = password.encode('utf-8')

    # Create a SHA-256 hash object
    sha256_hash = hashlib.sha256()

    # Update the hash object with the password bytes
    sha256_hash.update(password_bytes)

    # Get the hexadecimal representation of the hash
    hashed_password = sha256_hash.hexdigest()

    return hashed_password

# Example usage
password = "my_password123"
encoded_password = encode_password(password)
print(encoded_password)

# 482062c08643d4d054de279e4f6f69eb1b519ca9f1fd0662869f3633bc9866e2