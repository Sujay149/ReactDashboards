import fs from 'node:fs';

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", segment: "Premium" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", segment: "Basic" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", segment: "Premium" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", segment: "Basic" },
  { id: 5, name: "Emily Brown", email: "emily@example.com", segment: "Premium" },
  { id: 6, name: "David Lee", email: "david@example.com", segment: "Basic" },
  { id: 7, name: "Lisa Anderson", email: "lisa@example.com", segment: "Premium" },
  { id: 8, name: "Robert Taylor", email: "robert@example.com", segment: "Basic" },
  { id: 9, name: "Maria Garcia", email: "maria@example.com", segment: "Premium" },
  { id: 10, name: "James Wilson", email: "james@example.com", segment: "Basic" }
];

const eventTypes = ['page_view', 'click', 'purchase', 'form_submit', 'video_play', 'download'];
const eventNames = {
  page_view: ['Homepage View', 'Products Page', 'Product Details', 'Blog Page', 'Pricing Page', 'Contact Page', 'About Page', 'Account Page', 'Support Page'],
  click: ['Add to Cart', 'View Cart', 'Start Checkout', 'Apply Coupon', 'Share Product', 'Newsletter Signup', 'Like Product', 'Add to Wishlist'],
  purchase: ['Order Completed', 'Subscription Purchased'],
  form_submit: ['Contact Form', 'Sign Up Form', 'Feedback Form'],
  video_play: ['Product Video', 'Tutorial Video', 'Promo Video'],
  download: ['Brochure Download', 'Whitepaper Download', 'App Download']
};

const devices = ['desktop', 'mobile', 'tablet'];
const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
const osList = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
const referrers = ['direct', 'google.com', 'facebook.com', 'twitter.com', 'linkedin.com', 'bing.com'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateEvents(count) {
  const events = [];
  const startDate = new Date('2026-03-23T00:00:00.000Z');
  const endDate = new Date('2026-03-23T23:59:59.999Z');

  for (let i = 1; i <= count; i++) {
    const user = getRandomItem(users);
    const eventType = getRandomItem(eventTypes);
    const eventName = getRandomItem(eventNames[eventType]);
    const timestamp = getRandomDate(startDate, endDate);
    const sessionId = `sess_${Math.floor(Math.random() * 1000)}`;

    const baseEvent = {
      id: i,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userSegment: user.segment,
      eventType: eventType,
      eventName: eventName,
      timestamp: timestamp.toISOString(),
      properties: {
        sessionId: sessionId
      }
    };

    // Add type-specific properties
    if (eventType === 'page_view') {
      baseEvent.properties.page = `/${eventName.toLowerCase().replace(/ /g, '_')}`;
      baseEvent.properties.referrer = getRandomItem(referrers);
      baseEvent.properties.device = getRandomItem(devices);
      baseEvent.properties.browser = getRandomItem(browsers);
      baseEvent.properties.os = getRandomItem(osList);
    } else if (eventType === 'click') {
      baseEvent.properties.productId = `prod_${Math.floor(Math.random() * 1000)}`;
      if (eventName !== 'Newsletter Signup') {
        baseEvent.properties.productName = ['Wireless Headphones', 'Smart Watch', 'Laptop Bag', 'Coffee Maker', 'Desk Lamp'][Math.floor(Math.random() * 5)];
        baseEvent.properties.price = Math.floor(Math.random() * 200) + 10;
      }
    } else if (eventType === 'purchase') {
      baseEvent.properties.orderId = `ord_${Math.floor(Math.random() * 5000)}`;
      baseEvent.properties.totalAmount = Math.floor(Math.random() * 500) + 20;
      baseEvent.properties.itemsCount = Math.floor(Math.random() * 5) + 1;
      baseEvent.properties.paymentMethod = getRandomItem(['credit_card', 'paypal', 'apple_pay', 'google_pay']);
    } else if (eventType === 'form_submit') {
      baseEvent.properties.formType = eventName;
      baseEvent.properties.completionTime = Math.floor(Math.random() * 300) + 30;
    } else if (eventType === 'video_play') {
      baseEvent.properties.videoId = `vid_${Math.floor(Math.random() * 500)}`;
      baseEvent.properties.duration = Math.floor(Math.random() * 300) + 60;
      baseEvent.properties.watched = Math.floor(Math.random() * 100);
    } else if (eventType === 'download') {
      baseEvent.properties.fileName = `${eventName.toLowerCase().replace(/ /g, '_')}.pdf`;
      baseEvent.properties.fileSize = Math.floor(Math.random() * 20) + 1;
    }

    events.push(baseEvent);
  }

  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

const events = generateEvents(210);
const db = { events };

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log(`Generated ${events.length} events in db.json`);