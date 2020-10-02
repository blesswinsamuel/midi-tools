import React from 'react'

export default function MidiDeviceProperties({ device }) {
  if (!device) {
    return <div>Device not selected</div>
  }
  return (
    <table>
      <tbody>
        <tr>
          <th>Connection</th>
          <td>{device.connection}</td>
        </tr>
        <tr>
          <th>ID</th>
          <td>{device.id}</td>
        </tr>
        <tr>
          <th>Manufacturer</th>
          <td>{device.manufacturer}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{device.name}</td>
        </tr>
        <tr>
          <th>State</th>
          <td>{device.state}</td>
        </tr>
        <tr>
          <th>Type</th>
          <td>{device.type}</td>
        </tr>
      </tbody>
    </table>
  )
}
