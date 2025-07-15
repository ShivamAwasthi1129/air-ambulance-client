export default function FlyPrivateSection({data}) {
  const mainArticle = data && Array.isArray(data) && data[0]?.mainArticle ? data[0].mainArticle : {};
  
  const title = (
    <>
      <p className="flex justify-center">   
        <span className="text-blue-600 font-bold">{mainArticle.heading || "Fly Private in Dubai"}</span>{"  "}
        – Jets, Routes & Airports Covered</p>
    </>
  );

const imageSrc =
    // mainArticle.image ||
    "https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg";

  const paragraphs = mainArticle.paragraphs && mainArticle.paragraphs.length > 0
    ? mainArticle.paragraphs
    : [
        "Charter Flight AirAviation specializes in luxury private and business jet charters to and from Dubai, UAE. We offer access to a curated fleet of private aircraft at highly competitive rates—designed to match your needs and exceed your expectations.",
        "We also offer empty-leg flights and cost-efficient turboprop charters. With five airports within 50 miles of Dubai—like DXB, SHJ, and RKT—we make private air travel seamless and flexible.",
        "At Charter Flight AirAviation, we’re committed to delivering a world-class charter experience backed by 24/7 personalized support."
      ];

  const keyPoints = mainArticle.highlights && mainArticle.highlights.length > 0
    ? mainArticle.highlights
    : [
        "Midsize Jets: Hawker 800XP, Learjet 60XR",
        "Large Jets: Challenger 604, Legacy 600, Falcon 900DX",
        "Long-Range: Global Express XRS",
        "VIP Airliners: Embraer Lineage 1000"
      ];

  return (
    <section className="px-5 py-12 md:px-16 bg-white text-gray-800">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-10 text-center sm:text-left leading-snug">
        {title}
      </h2>

      {/* Content layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left section */}
        <div className="w-full lg:w-1/2 space-y-5 text-[18px] leading-relaxed">
          {/* First paragraph */}
          <p>{mainArticle.mainParagraph || paragraphs[0]}</p>

          {/* Key points section */}
          <div>
            <h3 className="text-blue-600 font-semibold text-base mb-2 text-[18px]">
              Popular aircraft available in the region include:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-[18px]">
              {keyPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

            {/* Remaining paragraphs */}
          {paragraphs.slice(0).map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
        {/* right section */}
        <div className="w-full lg:w-1/2">
          <img
            src={imageSrc}
            alt="Dubai Charter"
            className="rounded-2xl w-full h-auto shadow-md object-cover"
          />
        </div>
      </div>
    </section>
  );
}
