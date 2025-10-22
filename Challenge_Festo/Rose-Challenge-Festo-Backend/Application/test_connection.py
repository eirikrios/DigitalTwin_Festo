import mysql.connector
from Application.config import USUARIO, SENHA, SERVIDOR, DATABASE

def main():
    print("Testando conexão com o MySQL...")
    print(f" host={SERVIDOR}  user={USUARIO}  db={DATABASE}")
    try:
        cnx = mysql.connector.connect(
            host=SERVIDOR,
            user=USUARIO,
            password=SENHA,            
            database=DATABASE,
            auth_plugin="mysql_native_password",
        )
        print("✅ Conexão OK")
        cnx.close()
    except mysql.connector.Error as err:
        print("❌ Falhou:", err)

if __name__ == "__main__":
    main()