import sendMail from "@/config/nodeMailer";
import { NextResponse } from "next/server";

// =======================
// 1) Convert a string (possibly "HH:MM" or "HH:MM AM/PM") to "HH:MM AM/PM".
function convertTo12HourFormat(timeStr) {
  if (!timeStr || typeof timeStr !== "string") {
    return "N/A";
  }
  // If it already has AM/PM, just return it as-is.
  const upper = timeStr.toUpperCase();
  if (upper.includes("AM") || upper.includes("PM")) {
    return timeStr;
  }
  // Otherwise, assume it's in 24-hour format like "13:30"
  const [hhStr, mmStr = "00"] = timeStr.split(":");
  let hh = parseInt(hhStr, 10) || 0;
  let mm = parseInt(mmStr, 10) || 0;

  const suffix = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;

  const mmPadded = String(mm).padStart(2, "0");
  return `${hh}:${mmPadded} ${suffix}`;
}

// =======================
// 2) Parse an AM/PM time like "03:45 PM" into 24-hour { hours, minutes }
function parse12HourTo24Hour(time12h) {
  if (!time12h) return { hours: 0, minutes: 0 };

  const [timePart, modifier] = time12h.split(" ");
  if (!timePart || !modifier) return { hours: 0, minutes: 0 };

  let [hh, mm] = timePart.split(":").map(Number);
  const mod = modifier.toUpperCase();

  // Convert to 24h
  if (mod === "PM" && hh !== 12) {
    hh += 12;
  }
  if (mod === "AM" && hh === 12) {
    hh = 0;
  }
  return { hours: hh, minutes: mm || 0 };
}

// =======================
// 3) Parse flight duration string like "3h 20m"
function parseFlightDuration(durationStr) {
  if (!durationStr) return { hours: 0, minutes: 0 };

  const regex = /(\d+)h\s*(\d*)m?/; // e.g. "3h 20m"
  const match = durationStr.match(regex);

  let h = 0;
  let m = 0;
  if (match) {
    h = parseInt(match[1], 10) || 0;
    m = parseInt(match[2], 10) || 0;
  }
  return { hours: h, minutes: m };
}

// =======================
// 4) Add two sets of { hours, minutes }
function addHoursAndMinutes({ h1, m1 }, { h2, m2 }) {
  let totalMinutes = m1 + m2;
  let extraHours = Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  let totalHours = h1 + h2 + extraHours;
  return { hours: totalHours, minutes: totalMinutes };
}

// =======================
// 5) Convert 24-hour { hours, minutes } back to "HH:MM AM/PM"
function convert24HourTo12Hour(hours, minutes) {
  const suffix = hours >= 12 ? "PM" : "AM";
  let hh = hours % 12;
  if (hh === 0) hh = 12;

  const mmPadded = String(minutes).padStart(2, "0");
  return `${hh}:${mmPadded} ${suffix}`;
}

// =======================
// 6) Given a 12-hour departure time + duration "3h 20m", get an arrival time in 12-hour format.
function getArrivalTime(departureTime12h, flightDurationStr) {
  // Convert departure to 24-hour
  const depObj = parse12HourTo24Hour(departureTime12h);
  // Parse flight duration
  const durObj = parseFlightDuration(flightDurationStr);
  // Add them
  const arrivalObj = addHoursAndMinutes(
    { h1: depObj.hours, m1: depObj.minutes },
    { h2: durObj.hours, m2: durObj.minutes }
  );
  // Convert back to 12h
  return convert24HourTo12Hour(arrivalObj.hours, arrivalObj.minutes);
}

// =======================
// MAIN HANDLER
export const POST = async (req) => {
  try {
    // 1) Destructure input
    const {
      segments = [],
      user = {},
      tripType = "oneway",
      airportHandling = 0,
      subTotal = 0,
      gstAmount = 0,
      estimatedCost = 0,
    } = await req.json();

    // You can replace this with user.email if you want to send to their address
    const userEmail = "shivam@hexerve.com";
    const userPhone = user.phone || "+1 (000) 000-0000";
    const userName = user.name || "Valued Customer";

    // 2) Build the "flight segments" HTML
    const segmentsHTML = segments
      .map((segment) => {
        const {
          from = "Unknown Departure",
          to = "Unknown Arrival",
          fromCity,
          fromIATA,
          toCity,
          toIATA,
          departureDate,
          departureTime,
          selectedFleet = {},
        } = segment;

        const departureLabel =
          fromCity && fromIATA ? `${fromCity} (${fromIATA})` : from;
        const arrivalLabel = toCity && toIATA ? `${toCity} (${toIATA})` : to;

        const depDateStr = departureDate
          ? new Date(departureDate).toDateString()
          : "N/A";

        const depTime12 = convertTo12HourFormat(departureTime || "");
        const { model, type, time, registrationNo, price } = selectedFleet;
        const arrivalTimeStr = getArrivalTime(depTime12, time);

        return `
          <div style="padding: 15px; border-bottom: 1px solid #444;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: bold; color: #ffcc00;">#${registrationNo || "N/A"}</span>
              <span style="font-size: 0.9rem; color: #bbb;">${type || "Unknown Type"}</span>
              <span style="font-size: 0.9rem; color: #bbb;">${model || "Unknown Model"}</span>
              <span style="font-size: 0.9rem; color: #bbb;">${time || "N/A"}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; color: #fff;">
              <div>
                <strong style="font-size: 0.95rem;">${depDateStr}</strong><br/>
                <span style="font-size: 0.85rem;">Departure: ${depTime12}</span><br/>
                <small style="color: #ccc;">${departureLabel}</small>
              </div>
              <div style="text-align: right;">
                <strong style="font-size: 0.95rem;">Arrival: ${arrivalTimeStr}</strong><br/>
                <small style="color: #ccc;">${arrivalLabel}</small>
              </div>
            </div>
            ${
              price
                ? `<div style="margin-top: 10px; font-size:0.9rem; color:#ccc;">
                     Price for this segment: $${price}
                   </div>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    // 3) "Why Us?" block with images
    const whyUsHTML = `
      <div style="background:#1f1f1f; padding: 20px; color:#fff;">
        <h2 style="margin:0; font-size:1.1rem;">Why Us?</h2>
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: space-between;
            margin-top: 15px;
          "
        >
          <!-- 1) Unbeatable Savings -->
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <div
              style="
                background:#4a4a4a;
                width:40px; height:40px;
                border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                margin-right:10px;
              "
            >
              <img
                src="https://via.placeholder.com/40x40/ffcc00/000000?text=$"
                alt="Dollar sign"
                style="width:20px;height:20px;"
              />
            </div>
            <span style="font-size:0.9rem;">Unbeatable Savings</span>
          </div>

          <!-- 2) Access to Exclusive Deals -->
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <div
              style="
                background:#4a4a4a;
                width:40px; height:40px;
                border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                margin-right:10px;
              "
            >
              <img
                src="https://via.placeholder.com/40x40/ffcc00/000000?text=KEY"
                alt="Key Icon"
                style="width:20px;height:20px;"
              />
            </div>
            <span style="font-size:0.9rem;">Access to Exclusive Deals</span>
          </div>

          <!-- 3) Seamless Booking Experience -->
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <div
              style="
                background:#4a4a4a;
                width:40px; height:40px;
                border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                margin-right:10px;
              "
            >
              <img
                src="https://via.placeholder.com/40x40/ffcc00/000000?text=JET"
                alt="Plane Icon"
                style="width:20px;height:20px;"
              />
            </div>
            <span style="font-size:0.9rem;">Seamless Booking Experience</span>
          </div>

          <!-- 4) Tailored Solutions -->
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <div
              style="
                background:#4a4a4a;
                width:40px; height:40px;
                border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                margin-right:10px;
              "
            >
              <img
                src="https://via.placeholder.com/40x40/ffcc00/000000?text=Tools"
                alt="Tools Icon"
                style="width:20px;height:20px;"
              />
            </div>
            <span style="font-size:0.9rem;">Tailored Solutions</span>
          </div>

          <!-- 5) 24/7 Support -->
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <div
              style="
                background:#4a4a4a;
                width:40px; height:40px;
                border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                margin-right:10px;
              "
            >
              <img
                src="https://via.placeholder.com/40x40/ffcc00/000000?text=CS"
                alt="Headset Icon"
                style="width:20px;height:20px;"
              />
            </div>
            <span style="font-size:0.9rem;">24/7 Support</span>
          </div>

          <!-- 6) Client Satisfaction -->
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <div
              style="
                background:#4a4a4a;
                width:40px; height:40px;
                border-radius:50%;
                display:flex; align-items:center; justify-content:center;
                margin-right:10px;
              "
            >
              <img
                src="https://via.placeholder.com/40x40/ffcc00/000000?text=UP"
                alt="Thumbs Up Icon"
                style="width:20px;height:20px;"
              />
            </div>
            <span style="font-size:0.9rem;">Client Satisfaction</span>
          </div>
        </div>
      </div>
    `;

    // 4) Build the overall HTML email
    //    We'll insert a "banner" section right after the custom section ("Your Flight Request"):

    const html = `
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Flight Enquiry</title>
      </head>
      <body style="margin:0; padding:0; background:#f1f1f1; font-family:Arial, sans-serif;">
        <div style="max-width:600px; margin: 20px auto; background:#2c2c2c; color:#fff; border-radius: 6px; overflow:hidden;">
          
          <!-- Header / Company Branding -->
          <div style="
              background-color: #1f1f1f;
              padding: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div style="display:flex; align-items:center;">
              <!-- Replace with your real image link -->
              <img
                src="https://www.charterflightsaviation.com/images/logo.png"
                alt="charter flight aviations"
                style="height:50px; margin-right:10px;"
              />
              <h2 style="margin:0; color:#ffcc00; font-size:1.25rem; font-weight:bold;">
                Charter Flight Enquiry
              </h2>
            </div>
            <div style="text-align:right; color:#ffffff;">
              <p style="margin:0; font-size:0.9rem; font-weight:bold;">Binesh Paul</p>
              <p style="margin:0; font-size:0.8rem;">+1 331-258-2666</p>
            </div>
          </div>

          <!-- CUSTOM SECTION (replacing old Greeting & Intro) -->
          <div style="padding: 20px;">
            <h2 style="margin-top:0; font-size:1.2rem; color:#ffcc00;">Your Flight Request</h2>
            <p style="margin-top:10px; font-size:0.95rem; color:#ddd;">
              Hello, ${userName}! We have prepared your flight details as requested.
              Please review the information below. You can reach us at any time with questions.
            </p>
            <p style="font-size:0.95rem; color:#ddd;">
              <strong>Trip Type:</strong> ${tripType.toUpperCase()} <br/>
              <strong>Phone:</strong> ${userPhone} <br/>
              <strong>Email:</strong> ${userEmail}
            </p>
          </div>

          <!-- BANNER SECTION -->
          <div style="
            background-color: #333;
            padding: 20px;
            margin: 0 20px;
            border-radius: 6px;
            text-align:center;
          ">
            <img
              src="https://via.placeholder.com/560x140/333/ffcc00?text=Exclusive+Banner"
              alt="Exclusive Banner"
              style="width:100%; height:auto; max-width:560px; border-radius:4px;"
            />
            <p style="margin-top:10px; font-size:1rem; color:#ffcc00;">
              Special Offer: Save 10% on Your Next Charter!
            </p>
          </div>

          <!-- Flight Segments -->
          <div style="padding: 0 20px;">
            ${segmentsHTML}
          </div>

          <!-- Cost Breakdown -->
          <div style="padding:20px; border-top:1px solid #444;">
            <h3 style="margin-top:0; font-size:1rem; color:#fff;">Cost Breakdown</h3>
            <div style="font-size:0.9rem; color:#ccc; line-height:1.6;">
              <p><strong style="color:#ffcc00;">Approx cost:</strong> $${estimatedCost.toLocaleString()}</p>
            </div>
          </div>

          <!-- Why Us? -->
          ${whyUsHTML}

          <!-- Footer -->
          <div style="padding:20px; background:#1f1f1f;">
            <p style="margin:0; font-size:0.9rem; color:#aaa;">
              Sincerely,<br/>
              Binesh Paul<br/>
              <span style="font-size:0.8rem;">Feel free to reply to this email or call us with any questions.</span><br/>
              <span style="font-size:0.85rem; color:#fff;">binesh@charterflightaviations.in</span>
            </p>
          </div>
        </div>

        <!-- Fallback: address & privacy links -->
        <div style="text-align:center; margin-top:10px; font-size:0.8rem; color:#999;">
          Business Skies, 1 East Erie St, Suite 525-4518, Chicago IL 60611<br/>
          <a href="#" style="color:#999; text-decoration:none;">Privacy Policy</a> | 
          <a href="#" style="color:#999; text-decoration:none;">Terms & Conditions</a>
        </div>
      </body>
      </html>
    `;

    // 5) Send the email
    await sendMail(userEmail, "Flight Enquiry", html);

    // 6) Return success
    return NextResponse.json({ message: "success" });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
