from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permitir CORS

personas = [
    {"id": 1, "nombre": "Juan", "email": "juan@correo.com"},
    {"id": 2, "nombre": "Ana", "email": "ana@correo.com"},
]

# Listar personas
@app.route('/personas', methods=['GET'])
def obtener_personas():
    return jsonify(personas)

# Obtener persona por ID
@app.route('/personas/<int:id>', methods=['GET'])
def obtener_persona(id):
    persona = next((p for p in personas if p['id'] == id), None)
    if persona:
        return jsonify(persona)
    return jsonify({"mensaje": "Persona no encontrada"}), 404

# Crear persona
@app.route('/personas', methods=['POST'])
def crear_persona():
    data = request.get_json()
    nuevo_id = max([p['id'] for p in personas]) + 1 if personas else 1
    nueva_persona = {
        "id": nuevo_id,
        "nombre": data.get("nombre"),
        "email": data.get("email")
    }
    personas.append(nueva_persona)
    return jsonify(nueva_persona), 201

# Actualizar persona
@app.route('/personas/<int:id>', methods=['PUT'])
def actualizar_persona(id):
    data = request.get_json()
    for persona in personas:
        if persona['id'] == id:
            persona['nombre'] = data.get("nombre", persona['nombre'])
            persona['email'] = data.get("email", persona['email'])
            return jsonify(persona)
    return jsonify({"mensaje": "Persona no encontrada"}), 404

# Eliminar persona
@app.route('/personas/<int:id>', methods=['DELETE'])
def eliminar_persona(id):
    global personas
    personas = [p for p in personas if p['id'] != id]
    return '', 204

if __name__ == '__main__':
    app.run(port=5000, debug=True)
