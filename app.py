from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Mock Data
HOSPITALS = [
    {
        "id": 1,
        "name": "City General Hospital",
        "location": "Downtown, 2.5 km away",
        "timings": "24/7",
        "rating": 4.5,
        "doctors_available": ["Dr. Smith (Cardio)", "Dr. Jane (Neuro)"],
        "image": "/static/img/hospital_1.png",
        "phone": "+1 555-0123",
        "address": "123 Main St, Cityville"
    },
    {
        "id": 2,
        "name": "Sunrise Medical Center",
        "location": "Westside, 5.0 km away",
        "timings": "8:00 AM - 9:00 PM",
        "rating": 4.2,
        "doctors_available": ["Dr. Adams (Pediatrics)"],
        "image": "/static/img/hospital_2.png",
        "phone": "+1 555-0456",
        "address": "456 Oak Ave, Westside"
    },
    {
        "id": 3,
        "name": "Green Valley Care",
        "location": "North Hills, 8.2 km away",
        "timings": "24/7",
        "rating": 4.8,
        "doctors_available": ["Dr. Lee (Ortho)", "Dr. Kim (General)"],
        "image": "/static/img/hospital_3.png",
        "phone": "+1 555-0789",
        "address": "789 Pine Rd, North Hills"
    }
]

MEDICAL_SERVICES = [
    {"name": "Home Nurse Visit", "price": "$50/visit", "icon": "fa-user-nurse"},
    {"name": "Medicine Delivery", "price": "Variable", "icon": "fa-pills"},
    {"name": "Physiotherapy", "price": "$80/session", "icon": "fa-walking"},
    {"name": "Lab Sample Collection", "price": "$30/visit", "icon": "fa-vial"}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/diagnosis')
def diagnosis():
    return render_template('diagnosis.html')

@app.route('/hospitals')
def hospitals():
    return render_template('hospitals.html', hospitals=HOSPITALS)

@app.route('/services')
def services():
    return render_template('services.html', services=MEDICAL_SERVICES)

@app.route('/api/diagnose', methods=['POST'])
def api_diagnose():
    data = request.json
    symptoms = data.get('symptoms', '').lower()
    
    # Mock AI Logic with Rich Remedies
    diagnosis = "General Fatigue"
    remedy = """
    <ul class='list-disc pl-5 space-y-2 mt-2'>
        <li>Ensure you are getting at least 7-8 hours of sleep.</li>
        <li>Drink 8-10 glasses of water daily to stay hydrated.</li>
        <li>Reduce screen time, especially before bed.</li>
        <li><strong>Recommended:</strong> Complete Blood Count (CBC) test if it persists.</li>
    </ul>
    """
    severity = "Low"
    
    if "fever" in symptoms:
        diagnosis = "Viral Fever"
        remedy = """
        <ul class='list-disc pl-5 space-y-2 mt-2'>
            <li>Take Paracetamol (650mg) every 6 hours if fever is high.</li>
            <li>Use cool wet clothes (sponging) on the forehead.</li>
            <li>Drink plenty of fluids: coconut water, ORS, or soups.</li>
            <li><strong>Warning:</strong> If fever exceeds 103°F or lasts >3 days, see a doctor.</li>
        </ul>
        """
        severity = "Medium"
    elif "headache" in symptoms:
        diagnosis = "Migraine or Tension Headache"
        remedy = """
        <ul class='list-disc pl-5 space-y-2 mt-2'>
            <li>Rest in a dark, quiet room for at least 30 minutes.</li>
            <li>Apply a cold pack to your forehead or neck.</li>
            <li>Drink water; dehydration is a common trigger.</li>
            <li><strong>Avoid:</strong> Caffeine and bright screens.</li>
        </ul>
        """
        severity = "Low"
    elif "stomach" in symptoms or "pain" in symptoms:
        diagnosis = "Gastritis or Indigestion"
        remedy = """
        <ul class='list-disc pl-5 space-y-2 mt-2'>
            <li>Avoid spicy, oily, and acidic foods immediately.</li>
            <li>Drink cold milk or chamomile tea.</li>
            <li>Eat smaller, bland meals (e.g., rice, toast).</li>
            <li><strong>Medication:</strong> Antacids may help provide relief.</li>
        </ul>
        """
        severity = "Medium"
    elif "chest" in symptoms:
        diagnosis = "Potential Cardiac Issue (Warning)"
        remedy = """
        <ul class='list-disc pl-5 space-y-2 mt-2'>
            <li><strong>EMERGENCY:</strong> Do not drive yourself. Call an ambulance.</li>
            <li>Chew an Aspirin (300mg) if not allergic.</li>
            <li>Stay as calm as possible while waiting for help.</li>
            <li>Unlock your door for emergency responders.</li>
        </ul>
        """
        severity = "Critical"

    return jsonify({
        "diagnosis": diagnosis,
        "remedy": remedy,
        "severity": severity,
        "recommended_hospital": HOSPITALS[0]
    })

if __name__ == '__main__':
    import webbrowser
    import threading

    def open_browser():
        webbrowser.open_new('http://127.0.0.1:5000/')

    # Timer to open browser after a short delay to ensure server is running
    threading.Timer(1, open_browser).start()
    app.run(debug=True)
