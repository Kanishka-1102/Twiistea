export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F5F1EA] py-16 px-4 text-center">
        <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-3">Our Story</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          From India, With Love
        </h1>
        <p className="text-[#777] text-lg max-w-xl mx-auto">From the heart of India, to your cup</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-[#555] leading-relaxed space-y-5 text-base">
          <p>Twistea was born from a simple belief — that every Indian deserves access to the finest, most authentic teas their land has to offer. Founded in the foothills of Darjeeling, we work directly with small-scale, family-owned tea gardens to bring you teas of exceptional quality and character.</p>
          <p>We started as a small stall at a local market in Kolkata in 2020. What began as a passion project — sharing our grandmother's masala chai recipe — has grown into a beloved tea brand trusted by over 10,000 families across India.</p>
          <p>Every blend we craft carries a piece of India's rich tea heritage. From the delicate muscatel notes of our Darjeeling First Flush to the robust, malty warmth of our Assam Gold, each cup is a journey through India's most celebrated tea-growing regions.</p>
          <p>We are proud to be 100% natural, certified organic, and committed to fair trade practices that support the farmers who make our teas possible.</p>
        </div>
      </div>
    </div>
  );
}
