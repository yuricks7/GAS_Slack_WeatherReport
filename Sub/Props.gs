class Props {
  constructor() {
    const props = PropertiesService.getScriptProperties();

    this.apiToken       = props.getProperty('SLACK_ACCESS_TOKEN');
    this.channelId      = props.getProperty('CHANNEL_ID');
    this.channelId_test = props.getProperty('CHANNEL_ID_TEST');
  }
}