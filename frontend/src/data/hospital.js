// hospital.js — single source of truth for the website's sample content.
// Every fact here comes from the project's indexed knowledge base
// (Hospital_DOC/Greenfield_Hospital_Chatbot_FAQ.txt), which is clearly
// documented as synthetic sample data for a fictional hospital.
// Anything NOT in the knowledge base is labelled as demonstration content.

export const HOSPITAL = {
  name: "Green Field Hospital",
  shortName: "GFH",
  tagline: "Where Better Healthcare Meets Human Compassion.",
  positioning: "Modern healthcare. Compassionate people. Intelligent care.",
  // Sample contact data from the knowledge base (placeholders, non-working)
  address: "24 Riverside Road, Greenfield Junction, Kochi, Kerala 6820XX",
  phone: "+91 00000 10001",
  phoneLabel: "Reception · 24 hours",
  email: "helpdesk@example.invalid",
  emergencyNumber: "112", // India's universal emergency number
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Departments", href: "#departments" },
  { label: "Doctors", href: "#doctors" },
  { label: "Facilities", href: "#facilities" },
  { label: "Patient Info", href: "#patient-info" },
  { label: "Contact", href: "#contact" },
];

// Departments listed in knowledge base + supporting clinical services.
// Descriptions are kept general and responsible — no outcome claims.
export const DEPARTMENTS = [
  {
    id: "general-medicine",
    name: "General Medicine",
    icon: "Stethoscope",
    blurb: "Primary care for adults — fever, diabetes, blood-pressure follow-up and everyday health concerns.",
    kw: "Fever · Diabetes · BP care",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "HeartPulse",
    blurb: "Heart-health evaluation and ongoing care for blood pressure, rhythm and cholesterol concerns.",
    kw: "Heart check-ups · ECG",
  },
  {
    id: "paediatrics",
    name: "Paediatrics",
    icon: "Baby",
    blurb: "Care for infants, children and teens — routine check-ups, immunisation guidance and growth monitoring.",
    kw: "Child health · Vaccination",
  },
  {
    id: "obstetrics-gynaecology",
    name: "Obstetrics & Gynaecology",
    icon: "Ribbon",
    blurb: "Women's health across every stage — pregnancy care, wellness visits and preventive screenings.",
    kw: "Wellness · Antenatal",
  },
  {
    id: "orthopaedics",
    name: "Orthopaedics",
    icon: "Bone",
    blurb: "Bone, joint and muscle care — fractures, back pain, sports injuries and mobility support.",
    kw: "Joints · Fractures · Spine",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    icon: "ScanFace",
    blurb: "Skin, hair and nail care, from routine concerns to allergy evaluation and follow-up plans.",
    kw: "Skin · Hair · Allergy",
  },
  {
    id: "ent",
    name: "ENT",
    icon: "Ear",
    blurb: "Ear, nose and throat care — infections, hearing concerns, sinus trouble and throat conditions.",
    kw: "Hearing · Sinus · Throat",
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    icon: "Eye",
    blurb: "Eye examinations, vision assessment and ongoing management of common eye conditions.",
    kw: "Vision check · Eye exam",
  },
  {
    id: "dentistry",
    name: "Dentistry",
    icon: "Smile",
    blurb: "Everyday dental care for the whole family — cleanings, fillings and preventive advice.",
    kw: "Dental · Cleaning · Care",
  },
  {
    id: "emergency",
    name: "Emergency & Trauma",
    icon: "Siren",
    blurb: "Immediate assessment, 24 hours a day. For life-threatening situations call emergency services first.",
    kw: "24 hours · Round-the-clock",
  },
  {
    id: "radiology",
    name: "Radiology & Imaging",
    icon: "ScanLine",
    blurb: "Supporting every department with clear, timely diagnostic imaging and reporting.",
    kw: "Imaging · Reports · Scans",
  },
  {
    id: "laboratory",
    name: "Laboratory Services",
    icon: "FlaskConical",
    blurb: "Sample collection from 7:00 AM with routine and selected urgent tests — see patient info for hours.",
    kw: "Blood tests · Collection",
  },
];

// Doctors: demonstration profiles using the sample names published in the
// knowledge base. Photos are stock imagery from Unsplash — these cards are
// clearly labelled as demonstration content.
export const DOCTORS = [
  {
    name: "Dr. Ananya Menon",
    speciality: "General Medicine",
    photo: "/images/doc-2.jpg",
    quals: "Demonstration profile",
    hours: "Mon–Sat · 9:00 AM – 1:00 PM",
  },
  {
    name: "Dr. Rahul Nair",
    speciality: "Cardiology",
    photo: "/images/doc-1.jpg",
    quals: "Demonstration profile",
    hours: "Mon, Wed, Fri · 10:00 AM – 1:00 PM",
  },
  {
    name: "Dr. Meera Thomas",
    speciality: "Paediatrics",
    photo: "/images/doc-5.jpg",
    quals: "Demonstration profile",
    hours: "Mon–Sat · 9:30 AM – 12:30 PM",
  },
  {
    name: "Dr. Lakshmi Varma",
    speciality: "Obstetrics & Gynaecology",
    photo: "/images/doc-3.jpg",
    quals: "Demonstration profile",
    hours: "Mon–Fri · 10:00 AM – 1:00 PM",
  },
  {
    name: "Dr. Nikhil Das",
    speciality: "ENT",
    photo: "/images/doc-6.jpg",
    quals: "Demonstration profile",
    hours: "Mon, Wed, Sat · 2:00 PM – 4:00 PM",
  },
  {
    name: "Dr. Vivek Pillai",
    speciality: "Orthopaedics",
    photo: "/images/doc-4.jpg",
    quals: "Demonstration profile",
    hours: "Tue, Thu, Sat · 2:00 PM – 5:00 PM",
  },
];

export const FACILITIES = [
  {
    name: "Inpatient Rooms & Wards",
    photo: "/images/facility-room.jpg",
    text: "General ward and private room options — AC, non-AC and deluxe — with nurse call points and attendant seating. Bed rates are listed under Patient Information.",
    icon: "BedDouble",
  },
  {
    name: "Intensive Care",
    photo: "/images/facility-icu.jpg",
    text: "ICU beds for close monitoring, supported by continuous nursing care. Visits require permission from the care team.",
    icon: "Activity",
  },
  {
    name: "Laboratory & Diagnostics",
    photo: "/images/facility-lab.jpg",
    text: "Sample collection from 7:00 AM to 7:00 PM, with selected urgent tests available after hours.",
    icon: "FlaskConical",
  },
  {
    name: "Pharmacy",
    photo: "/images/facility-pharmacy.jpg",
    text: "In-house pharmacy open 7:00 AM to 11:00 PM. Medication availability should always be confirmed.",
    icon: "Pill",
  },
  {
    name: "Surgical Suites",
    photo: "/images/facility-surgery.jpg",
    text: "Operating facilities across specialities, with pre-operative assessment and post-operative care.",
    icon: "HeartPulse",
  },
  {
    name: "Emergency & Ambulance",
    photo: "/images/facility-emergency.jpg",
    text: "24-hour Emergency & Trauma department with a sample fleet of four ambulances — two BLS and two ALS.",
    icon: "Ambulance",
  },
];

export const WHY_US = [
  {
    title: "Patient-first approach",
    icon: "HeartHandshake",
    text: "Clear information, unhurried consultation time and a care team that explains decisions in plain language.",
  },
  {
    title: "Compassionate healthcare",
    icon: "HeartPulse",
    text: "Care that treats the person, not just the chart — respectful of your comfort, dignity and family.",
  },
  {
    title: "Dedicated medical professionals",
    icon: "Stethoscope",
    text: "Multiple specialities working together with shared responsibility for your treatment journey.",
  },
  {
    title: "Modern healthcare technology",
    icon: "Cpu",
    text: "Diagnostic and clinical support systems that help keep your care accurate, consistent and well-documented.",
  },
  {
    title: "Accessible patient information",
    icon: "FileText",
    text: "Fees, visiting hours, registration steps and appointment guidance — published, not a mystery.",
  },
  {
    title: "Integrated digital support",
    icon: "Sparkles",
    text: "GreenCare AI answers everyday questions about the hospital directly from our published information.",
  },
];

// Patient-experience highlights — clearly labelled illustrative content,
// NOT real patient reviews (no fabricated testimonials).
export const SAMPLE_EXPERIENCES = [
  {
    id: "s1",
    title: "Information found me, not the other way around",
    text: "I had simple questions before my visit — timings, registration, what to bring. The assistant answered directly and the front desk confirmed everything within minutes.",
    tag: "New patient",
    initials: "RS",
  },
  {
    id: "s2",
    title: "The ward visit felt organised and calm",
    text: "Clear visiting hours made planning easy. Our family knew exactly when to come, what allowed, and how to reach the ward without confusion.",
    tag: "Family visitor",
    initials: "MP",
  },
  {
    id: "s3",
    title: "Fees were not a surprise",
    text: "Asking about consultation and room charges before my visit meant the final bill matched what I expected. No mystery line items.",
    tag: "Inpatient",
    initials: "AK",
  },
];

export const PATIENT_INFO = {
  registration: [
    { k: "New-patient registration", v: "₹100" },
    { k: "Follow-up registration", v: "₹50 / visit" },
    { k: "General consultation", v: "₹300" },
    { k: "Specialist consultation", v: "₹500" },
    { k: "Medical certificate", v: "₹200 (doctor-authorized)" },
    { k: "Emergency initial assessment", v: "₹700 (tests & treatment may add charges)" },
  ],
  rooms: [
    { k: "General ward bed", v: "₹1,000 / day (shared; meals billed separately)" },
    { k: "Private room (non-AC)", v: "₹2,200 / day" },
    { k: "Private room (AC)", v: "₹3,500 / day" },
    { k: "Deluxe room", v: "₹5,000 / day (subject to availability)" },
    { k: "ICU bed", v: "₹8,000 / day (doctor, nursing & equipment billed separately)" },
  ],
  hours: [
    { k: "Emergency & Trauma", v: "24 hours, every day" },
    { k: "Reception", v: "24 hours, every day" },
    { k: "Laboratory (sample collection)", v: "7:00 AM – 7:00 PM" },
    { k: "Pharmacy", v: "7:00 AM – 11:00 PM" },
    { k: "General visiting hours", v: "4:00 PM – 6:00 PM (ICU visits by care-team permission)" },
  ],
  bring: [
    "A government-issued photo ID",
    "Previous prescriptions or test reports, if you have them",
    "Insurance information, if applicable",
  ],
  payments: "Cash, debit/credit card and UPI are listed payment methods. Always confirm insurance and cashless eligibility with the billing desk.",
};

export const SUGGESTED_QUESTIONS = [
  "What departments are available?",
  "What are the hospital's facilities?",
  "How can I contact the hospital?",
  "What are the visiting hours?",
  "How do I register as a new patient?",
  "What are the consultation fees?",
  "How do I request an appointment?",
  "Is emergency care available at night?",
];

export const GREETING =
  "Hello! Welcome to Green Field Hospital. I'm GreenCare AI, your intelligent hospital assistant. How can I help you today?";
