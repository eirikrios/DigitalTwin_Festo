from urllib.parse import quote_plus

USUARIO   = "festo"
SENHA_RAW = "ChallengeFi@p2025"         
SERVIDOR  = "127.0.0.1"
DATABASE  = "festochallenge"        

SGBD = "mysql+mysqlconnector"
SENHA_URI = quote_plus(SENHA_RAW)
SQLALCHEMY_DATABASE_URI = f"{SGBD}://{USUARIO}:{SENHA_URI}@{SERVIDOR}/{DATABASE}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = "*****"

SENHA = SENHA_RAW