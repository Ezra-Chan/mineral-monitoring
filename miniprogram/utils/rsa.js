const JSEncrypt = require("./jsencrypt.min");

const _pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/EIGVLbBTM947yMZ3bae8VVMb
V3VbA2viCm97gCU6D/vF2QfuFHLcEiYH20EVk6Loy+CUk7MuX0+nCn4wkANDwiEH
YD7xhBY/7524sTEdvA00iu8waSx54Kn3eIcyTHPnjmkfCCQykNVfcMHDQqCVTjme
8QVUmaBYCjTdnu6CiQIDAQAB
-----END PUBLIC KEY-----`;

const pubKey = new JSEncrypt();
pubKey.setPublicKey(_pubKey);

export const encrypt = data => pubKey.encrypt(data);

const _privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC/EIGVLbBTM947yMZ3bae8VVMbV3VbA2viCm97gCU6D/vF2Qfu
FHLcEiYH20EVk6Loy+CUk7MuX0+nCn4wkANDwiEHYD7xhBY/7524sTEdvA00iu8w
aSx54Kn3eIcyTHPnjmkfCCQykNVfcMHDQqCVTjme8QVUmaBYCjTdnu6CiQIDAQAB
AoGAEX0id165a0GYqn1Bbrt1T+pkKIu0B3LZOaq93fPytGKz0j4q7n0lrwTkQUeC
/hrHndUnnJdRHpdafvjuvbrjlB7ROiqRy5S3pme1K41vz+ywKbPZrJPvDkEYx+r7
c8j6N9s7KQIXWwRQKmosE++pplGQ+N7u3pNA9rm8ExX63mcCQQDRfoc5rpPpskP1
AgR5kiQnLTnk4KD8AVOg2y6U1KdgB0hAvG7VOdWcC/okvdY2kAXMuaRZaOrtrE7T
3eSnfH5zAkEA6XqfHOZSIU4CMbg/4Xke/HNP3OZDkSxkp6YO1jJDuS27zFjtrsrg
69weymP0SNSGWZfxjJcxHXBFU2Gn8iJgEwJAARPGfDxylEQPZ2YgQcPHnc/0uUGS
cllLZctavPcu+SZwb6zIYR5QA+Jn4eJ8BIHPFdNqje8lLh2xthMxBs90EwJBALsc
xGt6whNi2ytRiBCA6y5Sk4xrFXdA5qHc2UMcIV5Eop7QHhvZB4y+aga1OE8t00X2
GWUcvgXjtgtu1hOdLPUCQQCyg5v5XqJ3XD3skw8wCQ4SF/tNnJgAkyYPNrKMHFqf
3+dIO73BybOuC8uMk3549QAc2tR9UknWVVyvqboeRmip
-----END RSA PRIVATE KEY-----`;

const priKey = new JSEncrypt();
priKey.setPrivateKey(_privateKey);

export const decrypt = data => priKey.decrypt(data);
