let topics = [];
export function getTopic(topicName: string) {
    topics.push({topic:topicName});
}
export function sendTopic(consumer: any) {
    return topics;
}