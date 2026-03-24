import fs from 'node:fs';

// Read and verify the data
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

console.log(`Total events: ${db.events.length}`);
console.log('\nSample event structure:');
console.log(JSON.stringify(db.events[0], null, 2));

// Validate nested fields
const sampleEvent = db.events[0];
console.log('\nValidation Results:');
console.log(`✓ Has userId: ${sampleEvent.userId ? 'Yes' : 'No'}`);
console.log(`✓ Has userName: ${sampleEvent.userName ? 'Yes' : 'No'}`);
console.log(`✓ Has eventType: ${sampleEvent.eventType ? 'Yes' : 'No'}`);
console.log(`✓ Has timestamp: ${sampleEvent.timestamp ? 'Yes' : 'No'}`);
console.log(`✓ Has properties object: ${sampleEvent.properties ? 'Yes' : 'No'}`);
console.log(`✓ Properties has sessionId: ${sampleEvent.properties?.sessionId ? 'Yes' : 'No'}`);

// Count by event type
const eventTypes = {};
db.events.forEach(event => {
  eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
});
console.log('\nEvent type distribution:');
Object.entries(eventTypes).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

// User distribution
const userEvents = {};
db.events.forEach(event => {
  userEvents[event.userName] = (userEvents[event.userName] || 0) + 1;
});
console.log('\nTop users by event count:');
Object.entries(userEvents)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([user, count]) => {
    console.log(`  ${user}: ${count} events`);
  });