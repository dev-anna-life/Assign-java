import { Link } from 'react-router-dom';

const pages = {
  about: {
    title: 'About GiftHaven',
    icon: 'fa-info-circle',
    content: `
      GiftHaven is your premier destination for finding the perfect gift for every occasion. 
      Founded with a passion for helping people express their love through thoughtful gifting, 
      we curate the finest selection of products across electronics, jewelry, fashion, and lifestyle categories.
      Our team carefully selects each item to ensure it meets our standards of quality, 
      uniqueness, and gift-worthiness. Whether you're celebrating a birthday, anniversary, 
      holiday, or just because — GiftHaven makes gift-giving effortless and memorable.
    `,
  },
  contact: {
    title: 'Contact Us',
    icon: 'fa-envelope',
    content: `
      We'd love to hear from you! Whether you have a question about our products, 
      need help with an order, or just want to share feedback, our team is here to help.
      
      Email: support@GiftHaven.com
      Phone: +1 (555) 123-4567
      Address: 123 Gift Street, Suite 100, New York, NY 10001
      
      Business Hours:
      Monday - Friday: 9:00 AM - 6:00 PM EST
      Saturday: 10:00 AM - 4:00 PM EST
      Sunday: Closed
    `,
  },
  shipping: {
    title: 'Shipping Information',
    icon: 'fa-truck',
    content: `
      We offer fast and reliable shipping to ensure your gifts arrive on time.
      
      Standard Shipping (5-7 business days) — Free on orders over $50
      Express Shipping (2-3 business days) — $12.99
      Next Day Delivery (1 business day) — $24.99
      
      All orders are processed within 1-2 business days. You will receive a 
      tracking number once your order ships. We ship to all 50 US states 
      and select international destinations.
      
      Holiday orders: To ensure delivery by major holidays, please place your 
      order at least 7 days in advance for standard shipping.
    `,
  },
  returns: {
    title: 'Returns & Exchanges',
    icon: 'fa-undo',
    content: `
      Your satisfaction is our top priority. If you're not completely happy 
      with your purchase, we're here to help.
      
      Return Policy:
      • Items can be returned within 30 days of delivery
      • Products must be unused and in original packaging
      • Refunds are processed within 5-7 business days
      • Free returns on all orders
      
      To initiate a return, simply email us at returns@GiftHaven.com 
      with your order number and reason for return. We'll provide a 
      prepaid shipping label and guide you through the process.
      
      Exchanges are free and shipped as soon as we receive your return.
    `,
  },
};

export default function InfoPage({ pageKey }) {
  const page = pages[pageKey];
  if (!page) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-neutral-100">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
          <i className="fas fa-arrow-left"></i> Back to store
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <i className={`fas ${page.icon} text-white text-lg`}></i>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{page.title}</h1>
          </div>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
}
