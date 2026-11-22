import json
import random

clusters = [
    # Karnataka - Western Ghats & Hill Stations
    ('Kodagu / Madikeri', 12.4244, 75.7382, 1150, 45),
    ('Kodagu - Somwarpet & Kushalnagar', 12.5978, 75.8643, 1020, 35),
    ('Kodagu - Virajpet & Gonikoppa', 12.1985, 75.8052, 980, 35),
    ('Kodagu - Bhagamandala & Talakaveri', 12.3912, 75.5341, 1050, 30),
    ('Chikkamagaluru / Baba Budan', 13.3153, 75.7754, 1090, 40),
    ('Chikkamagaluru - Mudigere & Kalasa', 13.1364, 75.6384, 970, 35),
    ('Chikkamagaluru - Sringeri High Ridge', 13.4194, 75.2570, 850, 30),
    ('Hassan - Sakleshpur & Bisle Ghat', 12.9724, 75.7873, 950, 40),
    ('Shimoga - Agumbe & Thirthahalli', 13.5042, 75.0934, 650, 40),
    ('Uttara Kannada - Sirsi & Yellapur', 14.6195, 74.8354, 610, 35),
    ('Dakshina Kannada - Belthangady & Charmadi', 13.0422, 75.2891, 720, 35),
    ('Dakshina Kannada - Sullia & Subramanya', 12.5614, 75.3904, 680, 30),
    ('Udupi - Karkala & Kudremukh Base', 13.2163, 74.9976, 550, 30),
    ('Bengaluru & Nandi Hills Crest', 12.9716, 77.5946, 920, 50),
    ('Bengaluru Rural - Ramanagara High Rocks', 12.7209, 77.2799, 820, 30),
    ('Mysuru & Chamundi Elevated Ridge', 12.2958, 76.6394, 770, 35),

    # Kerala - Western Ghats High Ranges
    ('Wayanad - Kalpetta & Meppadi', 11.5512, 76.1287, 980, 45),
    ('Wayanad - Mananthavady & Vythiri', 11.8025, 76.0028, 920, 35),
    ('Wayanad - Sulthan Bathery Ridge', 11.6622, 76.2570, 990, 35),
    ('Idukki - Munnar High Mountain Valley', 10.0889, 77.0595, 1530, 45),
    ('Idukki - Devikulam & Nedumkandam', 9.8333, 77.1667, 1200, 35),
    ('Idukki - Peermade & Vandiperiyar', 9.5742, 77.0142, 1050, 30),
    ('Pathanamthitta - Ranni & Konni Hills', 9.3800, 76.7800, 580, 30),
    ('Palakkad - Attappadi Hills Catchment', 11.0800, 76.6800, 780, 30),
    ('Kozhikode - Thamarassery Churam Ridge', 11.4200, 75.9300, 620, 30),

    # Tamil Nadu - Western Ghats & Nilgiris
    ('Nilgiris - Ooty (Udhagamandalam)', 11.4102, 76.6950, 2240, 45),
    ('Nilgiris - Coonoor & Kotagiri', 11.3530, 76.7959, 1850, 35),
    ('Nilgiris - Gudalur Ridge', 11.5076, 76.4922, 1120, 30),
    ('Dindigul - Kodaikanal High Plateau', 10.2381, 77.4892, 2130, 40),
    ('Coimbatore - Valparai Tea Slopes', 10.3263, 76.9554, 1190, 30),
    ('Theni - Megamalai Hills Catchment', 9.7500, 77.4000, 1500, 25),
    ('Chennai Metro Coastal High Grounds', 13.0827, 80.2707, 45, 35),

    # Maharashtra - Western Ghats & Konkan Escarpment
    ('Satara - Mahabaleshwar & Panchgani', 17.9307, 73.6477, 1350, 40),
    ('Pune - Lonavala & Khandala Ghats', 18.7557, 73.4091, 620, 40),
    ('Raigad - Matheran Plateau Refuge', 18.9865, 73.2679, 800, 30),
    ('Kolhapur - Radhanagari & Panhala', 16.8122, 74.1132, 750, 30),
    ('Mumbai & Thane Elevated Ridge Centers', 19.0760, 72.8777, 65, 40),

    # Goa & Coastal Karnataka
    ('Goa - Canacona & Sattari Ghats', 15.0100, 74.0500, 420, 30),
    ('Mangaluru Elevated Hills & Moodabidri', 12.9141, 74.8560, 110, 30),

    # Himachal Pradesh - Himalayas
    ('Himachal - Shimla Ridge & Kufri', 31.1048, 77.1734, 2200, 40),
    ('Himachal - Manali & Kullu Valley', 32.2432, 77.1892, 2050, 40),
    ('Himachal - Dharamshala & McLeodGanj', 32.2190, 76.3234, 1457, 35),
    ('Himachal - Mandi & Solan Heights', 31.7087, 76.9320, 1150, 30),

    # Uttarakhand - Himalayas
    ('Uttarakhand - Dehradun & Mussoorie', 30.3165, 78.0322, 1880, 45),
    ('Uttarakhand - Nainital & Bhimtal', 29.3919, 79.4542, 2080, 40),
    ('Uttarakhand - Rishikesh & Devprayag', 30.0869, 78.2676, 620, 35),
    ('Uttarakhand - Chamoli & Rudraprayag', 30.4121, 79.3308, 1450, 30),

    # Northeast & Assam
    ('Meghalaya - Shillong & Cherrapunji', 25.5788, 91.8933, 1520, 40),
    ('Assam - Guwahati Elevated Ridge Centers', 26.1445, 91.7362, 180, 35),
    ('Sikkim - Gangtok & Namchi Hills', 27.3389, 88.6065, 1650, 35),
    ('Delhi NCR Elevated Emergency Relief Hubs', 28.6139, 77.2090, 240, 35)
]

types = [
    'Government Elevated Higher Secondary School',
    'District Indoor Sports Stadium Relief Hub',
    'Taluk Panchayat High-Ground Relief Camp',
    'Hilltop Temple Trust Community Hall',
    'Primary Health & Emergency Medical Station',
    'Rotary High-Ground Emergency Refuge',
    'Forest Range Elevated Station & Dormitory',
    'St. Marys Mission Elevated Community Center',
    'Municipal Town Hall Disaster Center',
    'Government Polytechnic High Ridge Campus'
]

supplies_list = [
    'Clean Potable Water, First Aid Kits, Power Generator, Satellite Phone, High-Energy Rations',
    'Medical Trauma Kit, Thermal Blankets, Water Purification Units, VHF Radio, Emergency Cots',
    'Dry Food Packets, Emergency Solar Inverter, Pediatric Care, Clean Sanitation, Rain Ponchos',
    'Emergency Shelter Tents, 24h Medical Doctor, Satellite WiFi, Drinking Water Tanks, Stretcher',
    'Hot Meal Kitchen, Life Jackets, Oxygen Cylinders, Emergency LED Lighting, First Aid'
]

shelters = []
idx = 1
random.seed(42)

for region_name, base_lat, base_lon, base_elev, count in clusters:
    clean_region = region_name.split(' - ')[0].split(' /')[0].strip()
    for i in range(count):
        # Scatter within ~15 km radius
        d_lat = random.gauss(0, 0.05)
        d_lon = random.gauss(0, 0.05)
        lat = round(base_lat + d_lat, 5)
        lon = round(base_lon + d_lon, 5)
        elev = int(base_elev + random.gauss(80, 50))
        t_type = random.choice(types)
        
        # Realistic Name
        name = f"{clean_region} {t_type} #{i+1:02d}"
        cap = random.randint(250, 1400)
        phone = f"+91 {random.randint(70000, 99999)} {random.randint(10000, 99999)}"
        
        shelters.append({
            'id': f'sh_safe_{idx:04d}',
            'region': region_name,
            'name': name,
            'type': t_type.split()[0] + ' ' + t_type.split()[1],
            'lat': lat,
            'lon': lon,
            'elevation_m': max(120, elev),
            'capacity': cap,
            'contact': f"{phone} (Disaster Helpline)",
            'supplies': random.choice(supplies_list),
            'status': 'Open & Ready'
        })
        idx += 1

print(f"Total safe places generated: {len(shelters)}")

with open('backend/data/shelters.json', 'w', encoding='utf-8') as f:
    json.dump(shelters, f, indent=2)

print("Saved successfully to backend/data/shelters.json")
