from flask import Flask
from flask_cors import CORS
from Application.extensions import db

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object("Application.config")

    db.init_app(app)

    from Application.views_simulacao_festo import bp_simulacao
    app.register_blueprint(bp_simulacao)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
