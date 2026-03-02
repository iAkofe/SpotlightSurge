const services = [
  {
    icon: "01",
    title: "Book Promotion",
    copy: "Reach your audience through editorial campaigns, social features, and launch bundles."
  },
  {
    icon: "02",
    title: "Author Interviews",
    copy: "Get in-depth with the minds behind the books through spotlight conversations."
  },
  {
    icon: "03",
    title: "Literary Events",
    copy: "Connect with the literary world through engaging online and in-person experiences."
  },
  {
    icon: "04",
    title: "Reader Community",
    copy: "Join a vibrant, growing network of readers who share recommendations and reviews."
  },
  {
    icon: "05",
    title: "Editorial Reviews",
    copy: "Gain meaningful critique and curated highlights that showcase your book's strengths."
  },
  {
    icon: "06",
    title: "Marketing Support",
    copy: "Amplify your message with practical strategy, positioning, and growth guidance."
  }
];

export default function ServicesSection() {
  return (
    <section className="services-section">
      <div className="container section-shell services-shell">
        <div className="section-title">
          <span className="section-tag">Supporting Authors, Enriching Readers</span>
          <h2>
            Whether you&apos;re promoting a book or discovering new voices,
            we&apos;re here for you.
          </h2>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.icon}>
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
