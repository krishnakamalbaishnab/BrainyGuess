from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Store the number in session
current_number = random.randint(1, 100)
attempts = 0
MAX_ATTEMPTS = 5

@app.route('/')
def index():
    global current_number, attempts
    current_number = random.randint(1, 100)
    attempts = 0
    # Pass both max_attempts and current attempts to the template
    return render_template('index.html', max_attempts=MAX_ATTEMPTS, attempts=attempts)

@app.route('/guess', methods=['POST'])
def guess():
    global current_number, attempts
    data = request.get_json()
    player_number = int(data['guess'])
    attempts += 1
    
    if player_number > current_number:
        result = "high"
    elif player_number < current_number:
        result = "low"
    else:
        result = "correct"
    
    # Check if player has run out of attempts
    game_over = attempts >= MAX_ATTEMPTS and result != "correct"
        
    return jsonify({
        'result': result,
        'attempts': attempts,
        'gameOver': game_over,
        'number': current_number if game_over else None
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000) 