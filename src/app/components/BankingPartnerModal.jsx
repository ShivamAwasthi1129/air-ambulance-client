"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";  // ← add this
const sameEmails = [
  "info@airambulance.co.in",
  "info@airambulanceaviation.com",
  "info@charterflights.com",
  "info@aerospaceaviation.org",
];

function base(label) {
  return {
    "Current A/C": "XXXX",
    Branch: "XXXX",
    GSTIN: "07ATCPP1219K2ZO",
    IFSC: "XXXX",
    "SWIFT Code": "XXXX",
  };
}

function genericThree(label) {
  return {
    "AIR AMBULANCE AVIATION": base(label),
    "CHARTER FLIGHTS AVIATION": base(label),
    "AERO SPACE AVIATION": base(label),
  };
}

export const BANKS = [
  /* ───────────── INDIAN PUBLIC SECTOR ───────────── */
  {
    bankName: "STATE BANK OF INDIA",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/SBI.png",
    timing: "10.00 am – 4.30 pm*",
    emails: sameEmails,
    accounts: {
      "AIR AMBULANCE AVIATION": {
        "Current A/C": "323-681-64-555",
        Branch: "Domestic Airport Palem",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "SBIN0010647",
        "SWIFT Code": "XXXXXXX",
      },
      "CHARTER FLIGHTS AVIATION": {
        "Current A/C": "323-681-71-028",
        Branch: "Domestic Airport Palem, Delhi",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "SBIN0010647",
        "SWIFT Code": "XXXXXXX",
      },
      "AERO SPACE AVIATION": {
        "Current A/C": "31373902968",
        Branch: "Sulthan Batheri",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "SBINB005099",
        "SWIFT Code": "SBININBB392",
      },
    },
  },

  /* ───────────── INDIAN PRIVATE BANKS ───────────── */
  {
    bankName: "HDFC BANK LTD",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/HDFC.png",
    timing: "Bank Time 10.00 am to 3.00 pm*",
    emails: sameEmails,
    accounts: {
      "AIR AMBULANCE AVIATION": {
        "Current A/C": "1595-200-0000-514",
        Branch: "Sulthan Batheri",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "HDFC0001595",
        "SWIFT Code": "HDFCINBB",
      },
      "CHARTER FLIGHTS AVIATION": base("HDFC"),
      "AERO SPACE AVIATION": base("HDFC"),
    },
  },
  {
    bankName: "ICICI BANK LTD",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/ICICI.png",
    timing: "10.00 am – 4.30 pm*",
    emails: sameEmails,
    accounts: genericThree("ICICI BANK"),
  },
  {
    bankName: "AXIS BANK LTD",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Axis.png",
    timing: "Bank Time 10.00 am to 3.30 pm*",
    emails: sameEmails,
    accounts: {
      "AIR AMBULANCE AVIATION": {
        "Current A/C": "9103-223-4384",
        Branch: "Cauvery Bhavan, Bengaluru [KT]",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "UTIB0000151",
        "SWIFT Code": "CODEXXXXX",
      },
      "CHARTER FLIGHTS AVIATION": {
        "Current A/C": "9104-022-2361",
        Branch: "Cauvery Bhavan, Bengaluru [KT]",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "UTIB0000151",
        "SWIFT Code": "CODEXXXXX",
      },
      "AERO SPACE AVIATION": {
        "Current A/C": "9104-023-2364",
        Branch: "Cauvery Bhavan, Bengaluru [KT]",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "UTIB0000151",
        "SWIFT Code": "CODEXXXXX",
      },
    },
  },
  {
    bankName: "YES BANK",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Yes+Bank.png",
    timing: "10.00 am – 4.30 pm*",
    emails: sameEmails,
    accounts: genericThree("YES BANK"),
  },

  /* ───────────── FORMER PSU / ASSOCIATE ───────────── */
  {
    bankName: "STATE BANK TRAVANCORE (SBT)",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/State+Bank+Of+Travancore.png",
    timing: "Bank Time 10.00 am to 3.00 pm*",
    emails: sameEmails,
    accounts: {
      "AIR AMBULANCE AVIATION": {
        "Current A/C": "6718-180-247",
        Branch: "Meenangadi",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "SBTR0000725",
        "SWIFT Code": "SBTINBBEFD",
      },
      "CHARTER FLIGHTS AVIATION": {
        "Current A/C": "6724-443-912",
        Branch: "Meenangadi",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "SBTR0000725",
        "SWIFT Code": "SBTINBBEFD",
      },
      "AERO SPACE AVIATION": {
        "Current A/C": "6724-443-912",
        Branch: "Meenangadi",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "SBTR0000725",
        "SWIFT Code": "SBTINBBEFD",
      },
    },
  },

  /* ───────────── INTERNATIONAL NAMES ───────────── */
  { bankName: "KOTAK MAHINDRA BANK LTD", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Kotak.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("KOTAK BANK") },
  { bankName: "STANDARD CHARTERED", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Standard+Chartered.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("STANDARD CHARTERED") },
  { bankName: "SWISS BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Swiss+Bank.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("SWISS BANK") },
  { bankName: "BARCLAYS BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Barclays.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("BARCLAYS BANK") },
  { bankName: "ABN AMRO BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/ABN+AMRO.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("ABN AMRO BANK") },
  { bankName: "RBS BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/RBS.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("RBS BANK") },
  { bankName: "BANK OF AMERICA", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Bank-Of-America.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("BANK OF AMERICA") },
  { bankName: "SCOTIA BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Scotia+Bank.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("SCOTIA BANK") },
  { bankName: "AMERICAN EXPRESS BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/American+Express.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("AMERICAN EXPRESS BANK") },
  { bankName: "DCB BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/DCB.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("DCB BANK") },
  { bankName: "DEUTSCHE BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Deutsche.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("DEUTSCHE BANK") },
  { bankName: "UBS BANK", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/UBS.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("UBS BANK") },
  { bankName: "HSBC BANK LTD", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/HSBC.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("HSBC BANK") },
  { bankName: "CITI BANK LTD", logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/Citi.png", timing: "10.00 am – 4.30 pm*", emails: sameEmails, accounts: genericThree("CITI BANK") },

  /* ING Vysya (now Kotak) – screenshot had real numbers */
  {
    bankName: "ING VYSYA BANK",
    logo: "https://airambulance.s3.ap-south-1.amazonaws.com/BankImages/Bank+Logos/ING.png",
    timing: "10.00 am – 4.30 pm*",
    emails: sameEmails,
    accounts: {
      "AIR AMBULANCE AVIATION": {
        "Current A/C": "5900-1101-6110",
        Branch: "Vasant Vihar – New Delhi",
        GSTIN: "07ATCPP1219K2ZO",
        IFSC: "VYSA0005900",
        "SWIFT Code": "VYSABINBBD",
      },
      "CHARTER FLIGHTS AVIATION": base("ING VYSYA BANK"),
      "AERO SPACE AVIATION": base("ING VYSYA BANK"),
    },
  },
];


/* ---------- 2.  MODAL COMPONENT  ---------- */
export default function BankingPartnersModal({
  open = true,
  onClose,
  height = "90vh", // customise from parent if you want
}) {
  const handleClose = useCallback(() => onClose?.(), [onClose]);
  if (!open) return null;

  return (
    /* ---------- Back-drop ---------- */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* ---------- Modal shell ---------- */}
      <div
        className="relative mx-4 w-full max-w-7xl rounded-2xl bg-gray-100 shadow-2xl ring-1 ring-black/10
                   animate-[zoomIn_.3s_ease]"
        style={{ height }}
      >
        {/* top close */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full bg-gray-200 p-1.5 text-gray-700 hover:bg-gray-300"
        >
          <IoClose size={22} />
        </button>

        {/* ---------- Scrollable content ---------- */}
        <div className="flex h-full flex-col">
          {/* header banner stays fixed on top of scroll area */}
          <Banner />

          {/* everything below scrolls */}
          <div className="grow overflow-y-auto px-6 pb-20 pt-8 md:px-10">
            <PaymentNotice />

            <div className="mt-10">
              <PaymentForm />
            </div>

            <div className="mt-10 h-[calc(100vh-32rem)] overflow-y-auto">
              {/* 32 rem ≈ banner + notice + form + padding; adjust if needed */}
              <BankTable banks={BANKS} />
            </div>
          </div>

          {/* bottom close */}
          <div className="border-t p-4 text-center">
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-5 py-2 text-sm font-medium
                         text-gray-700 hover:bg-gray-300"
            >
              <IoClose size={16} /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3.  Sub-components  ---------- */

function Banner() {
  return (
    <div className="relative">
      <Image
        src="https://img.freepik.com/free-photo/businessmen-handshake_587448-5043.jpg?t=st=1746016182~exp=1746019782~hmac=7ec40ba5468570606d3d4dd4040643f4e5d5e39c8162b92ae728d15b1839b858&w=1380"
        alt="Handshake"
        width={1600}
        height={60}
        className="h-[8rem] w-full rounded-t-2xl object-cover"
        priority
      />
      <h1 className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-white drop-shadow-lg">
        Our&nbsp;Banking&nbsp;Partners
      </h1>
    </div>
  );
}

function PaymentNotice() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6">
      <Image
        src="https://airambulance.s3.ap-south-1.amazonaws.com/AircraftGallery/3d-hand-making-cashless-payment-from-smartphone.jpg"
        alt="Digital payment"
        width={220}
        height={220}
        className="absolute -right-4 bottom-0 hidden select-none md:block"
      />
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <span className="inline-block h-2 w-2 rounded-full bg-gray-500" />
        Please print this page
      </h2>
      <ul className="space-y-1 text-sm leading-relaxed text-gray-700">
        <li>Make sure the payments are without any bank charges.</li>
        <li>
          Payments can be made <b>DD / CHEQUE / NEFT / FOREX TRANSFER / SWIFT TRANSFER</b>.
        </li>
        <li>
          <b>Subject to realisation:</b> online payments will attract service tax which will be
          additional to the rescue charges.
        </li>
        <li>
          After depositing the money please call and confirm to your rescue controller and also mail
          to:
        </li>
      </ul>
      <p className="mt-3 space-x-4 text-sm font-medium text-sky-600">
        <a href="mailto:info@airambulanceaviation.com" className="hover:underline">
          info@airambulanceaviation.com
        </a>
        <span>|</span>
        <a href="mailto:info@airambulance.co.in" className="hover:underline">
          info@airambulance.co.in
        </a>
      </p>
    </div>
  );
}
function PaymentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accName, setAccName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Provide your payment details</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);

          // 1. Load current searchData
          const raw = sessionStorage.getItem("searchData") || "{}";
          const current = JSON.parse(raw);

          // 2. Merge name/email/phone from loginData into user_info
          const loginRaw = sessionStorage.getItem("loginData") || "{}";
          const login = JSON.parse(loginRaw);
          current.userInfo = {
            ...(current.userInfo || {}),
            name: current.userInfo?.name || login.name,
            email: current.userInfo?.email || login.email,
            phone: current.userInfo?.phone || login.phone,
          };

          // 3. Fetch exchangeRates and calculate totalAmount
          const exchangeRatesRaw = sessionStorage.getItem("exchangeRates") || "{}";
          const exchangeRates = JSON.parse(exchangeRatesRaw);
          const inrRate = exchangeRates.inrRate || 1; // Default to 1 if inrRate is not available

          // Calculate totalAmount by summing up converted prices for all segments
          current.totalAmount = current.segments.reduce((total, segment) => {
            const priceInDollars = parseFloat(segment.selectedFleet?.price || 0); // Get price from selectedFleet
            const priceInINR = priceInDollars * inrRate; // Convert to INR
            return total + priceInINR; // Add to total
          }, 0);

          // 4. Append payment fields
          current.acc_name = accName.trim();
          current.acc_no = accNo.trim();
          current.reference_id = referenceId.trim();
          current.amount = Number(amount);
          current.currency = "INR";

          // 5. Write back to sessionStorage
          sessionStorage.setItem("searchData", JSON.stringify(current));

          // 5. POST to backend
          try {
            const res = await fetch("/api/booking", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(current),
            });
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Error: ${errorText}`);
            }
            const { url } = await res.json();
            if (url) {
              router.push(url);
            } else {
              throw new Error("Redirect URL not found in the response.");
            }
            // Reset form fields
            setAccName("");
            setAccNo("");
            setReferenceId("");
            setAmount("");
          } catch (err) {
            console.error("Booking submission failed:", err);
            alert("Sorry, something went wrong while submitting your booking.");
          } finally {
            setIsLoading(false);
          }
        }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* account holder name */}
        <Input
          label="Account Holder Name"
          placeholder="e.g. Bineesh Paul"
          value={accName}
          onChange={(e) => setAccName(e.target.value)}
        />
        {/* account */}
        <Input
          label="Account Number"
          placeholder="e.g. 323-681-64-555"
          value={accNo}
          onChange={(e) => setAccNo(e.target.value)}
        />
        {/* txn id */}
        <Input
          label="Transaction ID / UTR"
          placeholder="e.g. SBINTR2304XXXX"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
        />
        <Input
          label="Amount"
          type="number"
          placeholder="e.g. 1500.00"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {/* submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg
             bg-green-600 px-6 py-2.5 text-sm font-semibold text-white
             shadow-md transition hover:bg-green-700 focus:outline-none
             focus-visible:ring-2 focus-visible:ring-green-500"
          >
            {isLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Sending…
              </>
            ) : (
              "Submit Details"
            )}
          </button>

        </div>
      </form>

    </div>
  );
}

function BankTable({ banks }) {
  /* every bank object uses the same three account keys, so
     just read them from the first element */
  const accountKeys = Object.keys(banks[0].accounts);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-left text-sm text-gray-800">
        {/* ---------- single, sticky header ---------- */}
        <thead className="sticky top-0 z-10 bg-gray-100 text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="whitespace-nowrap px-4 py-3">Banks</th>
            {accountKeys.map((key) => (
              <th key={key} className="px-4 py-3">
                {key.replaceAll(" ", "\u00A0")}
              </th>
            ))}
            <th className="px-4 py-3">
              Bank&nbsp;Time&nbsp;&amp;
              <br />
              Email&nbsp;ID
            </th>
          </tr>
        </thead>
        {/* ---------- all rows ---------- */}
        <tbody>
          {banks.map((bank) => (
            <tr key={bank.bankName} className="border-t last:border-0">
              {/* logo + name */}
              <td className="flex items-center flex-col-reverse gap-2 px-4 py-5">
                <Image
                  src={bank.logo}
                  alt={bank.bankName}
                  width={52}
                  height={52}
                  className="h-[4.5rem] w-[18.5rem] object-contain"
                />
                <span className="font-normal text-xs">{bank.bankName}</span>
              </td>

              {/* the three account columns */}
              {accountKeys.map((acc) => (
                <td key={acc} className="whitespace-pre-line px-4 py-5 align-top">
                  {Object.entries(bank.accounts[acc]).map(([k, v]) => (
                    <div key={k}>
                      <b>{k}</b>{v}
                    </div>
                  ))}
                </td>
              ))}
              {/* timing & e-mails */}
              <td className="whitespace-pre-line px-4 py-5 align-top">
                <b>Time&nbsp;</b> {bank.timing}
                <br />
                <b>Email&nbsp;ID</b>
                <br />
                {bank.emails.join("\n")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- 4.  Re-usable tiny helpers ---------- */

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700 ">{label}</label>
      <input
        required
        {...props}
        className="rounded-md border-gray-300  px-3 py-2 text-sm shadow-inner
                   focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
    </div>
  );
}

function Select({ label, options, placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <select
        required
        defaultValue=""
        className="rounded-md border-gray-300 px-3 py-2 text-sm shadow-inner
                   focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
