// InfoStrip.jsx — slim trust bar directly under the hero: the four facts
// patients check first, all from the indexed knowledge base.

import { Ambulance, Clock, CreditCard, MapPin } from "lucide-react";
import { PATIENT_INFO } from "../data/hospital.js";

export default function InfoStrip() {
  const lab = PATIENT_INFO.hours.find((h) => h.k.startsWith("Laboratory"))?.v ?? "7:00 AM – 7:00 PM";

  return (
    <div className="strip" aria-label="Key hospital facts">
      <div className="container--wide strip__inner">
        <div className="strip__item strip__item--accent">
          <span className="strip__icon"><Ambulance size={22} aria-hidden="true" /></span>
          <div>
            <div className="strip__label">Emergency &amp; Trauma</div>
            <div className="strip__value">Open 24 hours, every day</div>
          </div>
        </div>
        <div className="strip__item">
          <span className="strip__icon"><Clock size={22} aria-hidden="true" /></span>
          <div>
            <div className="strip__label">Pharmacy &amp; Lab</div>
            <div className="strip__value">7:00 AM onwards</div>
          </div>
        </div>
        <div className="strip__item">
          <span className="strip__icon"><CreditCard size={22} aria-hidden="true" /></span>
          <div>
            <div className="strip__label">Payments</div>
            <div className="strip__value">Card · UPI · Cash</div>
          </div>
        </div>
        <div className="strip__item">
          <span className="strip__icon"><MapPin size={22} aria-hidden="true" /></span>
          <div>
            <div className="strip__label">Visiting hours</div>
            <div className="strip__value">General · 4–6 PM daily</div>
          </div>
        </div>
      </div>
    </div>
  );
}
