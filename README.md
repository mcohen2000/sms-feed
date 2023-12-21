# SMS Feed

This is a [T3 Stack](https://create.t3.gg/) project designed to empower individuals and businesses to set up and manage SMS-based services. This application would greatly benefit people looking to deliver news letters, marketing updates, and notifications. The service is controlled from a dashboard where admins can create and manage posts, which can later be sent or scheduled for delivery at a future time. Admins can also review analytics like monthly subscribers, total subscribers, and total messages sent.

## Technology Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [PostgreSQL](https://www.postgresql.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Twilio](https://www.twilio.com)

## Dashboard

### Post Manager
Overview:
| Name               | Type           | Description                                                                                      | Arguments                                            |
| :------------------: |:------------:| :-----------------------------------------------------------------------------------------------:| :--------------------------------------------------: |
| getWelcomeMsg      | Query          | Finds first post where "isWelcomeMsg: true".                                                     | None                                                 |
| create             | Mutation       | Creates post for dashboard, but if getWelcomeMsg returns null, then will create welcome message. | <ul><li>text: String<br/>(Min Length: 1, Max Length: 1530)</li><li>isWelcomeMsg: Boolean</li><li>createdBy: User</li></ul>|
| getAll             | Query          | Retrieves all posts for dashboard and queue that match filters if included. Does not include welcome message. | <ul><li>search: String</li><li>sent: String</li><li>page: String</li><li>sortBy: String</li></ul>|
| count              | Query          | Returns number of posts retrieved in getAll query. Used for display of pagination info. Does not include welcome message. | <ul><li>search: String</li><li>sent: String</li></ul>|
| countSent          | Query          | Returns number of outboundWebhooks where "smsStatus: "delivered". Used for display of messages sent on Analytics page. Includes welcome messages. | None |
| update             | Mutation       | Updates post where "id: input.id". | <ul><li>id: String<br/>(Min Length: 1)</li><li>text: String<br/>(Min Length: 1, Max Length: 1530)</li></ul>|
| delete             | Mutation       | Deletes post where "id: input.id". | <ul><li>id: String<br/>(Min Length: 1)</li></ul>|
| send               | Mutation       | Triggers twilio.messages.create for each subscriber on post where "id: input.id". If schedule argument is included, then the schedule date is validated before scheduling the messages. When messages are successfully sent or scheduled, an outboundWebhook is created in the database. The post and subscribers are linked to the outboundWebhooks.  | <ul><li>id: String<br/>(Min Length: 1)</li><li>schedule: String<br/>(Min Length: 1)</li></ul>|
| cancelScheduled     | Mutation       | Finds all outboundWebhooks where " postId: input.postId, smsStatus: 'scheduled' ". Triggers twilio.message.update with "status: canceled" for each outboundWebhook, then updates the database.  | <ul><li>postId: String<br/>(Min Length: 1)</li></ul>|
| updateOutboundWebhook | Mutation       | Triggered by Twilio HTTP webhooks to update the status of outboundWebhooks.  | <ul><li>smsSid: String<br/>(Min Length: 1)</li><li>status: String</li><li>from: String<br/>(Nullable - Not included until status === "delivered")</li><li>doneDate: String<br/>(Nullable - Not included until status === "delivered")</li></ul>|
| handleInboundWebhook | Mutation       | Triggered by Twilio HTTP webhooks to process inbound SMS messages sent to Twilio phone number. Allows subscribers to toggle subscription / optedOut field on subscriber model.   | <ul><li>smsSid: String<br/>(Min Length: 1)</li><li>numMedia: Number</li><li>numSegments: Number</li><li>body: String</li><li>to: String</li><li>from: String</li><li>optOutType: String</li><li>status: String</li><li>toCountry: String</li><li>toState: String</li><li>toCity: String</li><li>toZip: String</li><li>fromState: String</li><li>fromCity: String</li><li>fromZip: String</li></ul>|
| subscriberCount | Query       | Returns number of subscribers. Used for display of total subscribers on Analytics page.   | None |
| subscriberMonthlyCount | Query       | Returns an array of objects which has the month and number of subscribers gained that month. Used for display of monthly sign ups on Analytics page.   | None |


![Posts](https://github.com/mcohen2000/sms-feed/assets/65527695/5fcfa52e-d5e7-4f40-a09a-d10c584c9e23)
Set Welcome Message:
![Set Welcome Message](https://github.com/mcohen2000/sms-feed/assets/65527695/bbab7aff-5b26-43e9-bfb1-c497dd8431fd)
Edit Post:
![Edit Post](https://github.com/mcohen2000/sms-feed/assets/65527695/5dc30705-ef3c-4798-b51f-1728a7d6e9d7)
Delete Post:
![Delete Post](https://github.com/mcohen2000/sms-feed/assets/65527695/969b2976-1f9b-4cfb-8b40-0ece4b6e59d4)
Send Post:
![Send Post](https://github.com/mcohen2000/sms-feed/assets/65527695/bb108423-71f6-4092-808e-446f7650b7ee)
Schedule Post:
![Schedule Send Post](https://github.com/mcohen2000/sms-feed/assets/65527695/c6659976-e0c4-4560-9bfa-3f40ec043359)
### Post Queue
![Queue](https://github.com/mcohen2000/sms-feed/assets/65527695/e6fdc9e5-e327-4112-b493-a56d6d9c02ab)
### Post Analytics
![Analytics](https://github.com/mcohen2000/sms-feed/assets/65527695/815b6ecb-d00d-41ab-8292-332304429161)
