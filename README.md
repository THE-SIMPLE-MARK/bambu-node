# Bambu Node

A node.js library for connecting to and receiving data from Bambu Lab printers through
their MQTT servers.
- Every command & response field is documented & typed.
- Easily (and safely*) construct commands & manage responses.
- Full async support! `client#executeCommand` waits until the command completion is verified by the printer.

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js
- NPM
- TypeScript

> [!CAUTION]  
> TypeScript is highly recommended for this package due to the type safety it provides.
> This is especially important in use cases like this project where the library communicates
> with external hardware which can very well come with property damage. And even with
> TypeScript, I am not liable for any such damages as stated in the [license](LICENSE).

### Installation

```bash
npm install bambu-node
```

### Example Usage

```typescript
import { BambuClient, Fan, UpdateFanCommand } from "bambu-node";

// define a printer connection
const client = new BambuClient({
  host: "your_printers_ip",
  accessToken: "your_printers_access_token", 
  serialNumber: "your_printers_sn",
});

// more about the available events below
client.on("printer:statusUpdate", (oldStatus, newStatus) => {
  console.log(`The printers status has changed from ${oldStatus} to ${newStatus}!`);
});

// connect to the printer
await client.connect();

// update the speed of the auxiliary fan to 100%
await client.executeCommand(
  new UpdateFanCommand({ fan: Fan.AUXILIARY_FAN, speed: 100 })
);

// we don't want to do anything else => we close the connection
// (can be kept open indefinitely if needed)
await client.disconnect();
```

## API

- Bambu Node
  - Class: `BambuClient`
    - Events: `BambuClient#on`
      - `message`
      - `rawMessage`
      - `printer:dataUpdate`
      - `printer:statusUpdate`
      - `job:start`
      - `job:pause`
      - `job:unpause`
      - `job:finish`
      - `job:finish:success`
      - `job:finish:failed`
      - `job:finish:unexpected`
    - Method: `BambuClient.connect()`
    - Method: `BambuClient.disconnect()`
    - Method: `BambuClient.subscribe(topic)`
    - Method: `BambuClient.executeCommand(command)`
  - Class: `Job`
    - Method: `Job.update(data)`
    - Getter: `Job.data`
  - Class: `AbstractCommand`
    - Class: `GCodeCommand`
      - `GCodeFileCommand`
      - `GCodeLineCommand`
    - `GetVersionCommand`
    - `PushAllCommand`
    - `UpdateFanCommand`
    - `UpdateLightCommand`
    - `UpdateSpeedCommand`
    - `UpdateStateCommand`
    - `UpdateTempCommand`
  - *Command Responses*
    - info
      - Class: `InfoMessageCommand`
        - `GetVersionResponse`
    - mcPrint
      - Class: `McPrintMessageCommand`
        - `PushInfoResponse`
    - print
      - Class: `PrintMessageCommand`
        - `GCodeFileResponse`
        - `GCodeLineResponse`
        - `ProjectFileResponse`
        - `PushAllResponse`
          - `PushStatusResponse`
        - `UpdateFanResponse`
        - `UpdateLightResponse`
        - `UpdateSpeedResponse`
        - `UpdateStateResponse`
        - `UpdateTempResponse`

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT © Márk Böszörményi](LICENSE)