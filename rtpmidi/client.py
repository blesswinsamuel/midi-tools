from builtins import bytes

from optparse import OptionParser
import logging
import select
import socket
import sys
import time

import pymidi.client
from pymidi.protocol import DataProtocol
from pymidi.protocol import ControlProtocol
from pymidi import packets, utils

try:
    import coloredlogs
except ImportError:
    coloredlogs = None

logger = logging.getLogger('pymidi.examples.server')

DEFAULT_BIND_ADDR = '0.0.0.0:5051'

parser = OptionParser()
parser.add_option(
    '-b',
    '--bind_addr',
    dest='bind_addrs',
    action='append',
    default=None,
    help='<ip>:<port> for listening; may give multiple times; default {}'.format(
        DEFAULT_BIND_ADDR),
)
parser.add_option(
    '-v', '--verbose', action='store_true', dest='verbose', default=False, help='show verbose logs'
)


def main():
    options, args = parser.parse_args()

    log_level = logging.DEBUG if options.verbose else logging.INFO
    if coloredlogs:
        coloredlogs.install(level=log_level)
    else:
        logging.basicConfig(level=log_level)

    host = '192.168.1.10'
    port = 5004
    client = pymidi.client.Client(addr='192.168.1.10:5004')
    logger.info(f'Connecting to RTP-MIDI server @ {host}:{port} ...')
    logger.info('Connecting!')
    while True:
        logger.info('Striking key...')
        send_note_on(client, 30)
        time.sleep(0.5)
        send_note_off(client, 30)
        time.sleep(0.5)


def send_note_on(self, key, velocity=127, channel=0):
    command = packets.COMMAND_NOTE_ON | channel
    data = b'\x43' + \
        command.to_bytes(1, 'big') + key.to_bytes(1, 'big') + \
        velocity.to_bytes(1, 'big')
    return self.send_midi_command(data)


def send_note_off(self, key, velocity=127, channel=0):
    command = packets.COMMAND_NOTE_OFF | channel
    data = b'\x43' + \
        command.to_bytes(1, 'big') + key.to_bytes(1, 'big') + \
        velocity.to_bytes(1, 'big')
    return self.send_midi_command(data)


main()
