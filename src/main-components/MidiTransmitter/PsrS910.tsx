import { Button, ButtonGroup, Divider, HTMLSelect } from '@blueprintjs/core'
import React from 'react'
import { Output } from 'webmidi'
import Select from '../../components/Select'

const YAMAHA_ID = 0x43

//  (\d+) (\d+) (\d+) (S\.Articulation!|Live!|Regular|Cool!|Sweet!|SFX Kit|OrganFlutes|MegaVoice|Drums)(['"]) \},
//  $5, type: '$4', msb: $1, lsb: $2, prg: $3 },

const VOICE_LIST = [
  {
    category: 'Piano',
    voices: [
      { name: 'GrandPiano', type: 'Live!', msb: 0, lsb: 113, prg: 1 },
      { name: 'WarmGrand', type: 'Live!', msb: 0, lsb: 114, prg: 1 },
      { name: 'BrightPiano', type: 'Live!', msb: 0, lsb: 112, prg: 2 },
      { name: 'BalladStack', type: 'Regular', msb: 0, lsb: 114, prg: 3 },
      { name: 'MIDIGrand', type: 'Regular', msb: 0, lsb: 112, prg: 3 },
      { name: 'Harpsichord', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 113 },
      { name: 'OctavePiano1', type: 'Live!', msb: 0, lsb: 113, prg: 4 },
      { name: 'OctavePiano2', type: 'Live!', msb: 0, lsb: 114, prg: 4 },
      { name: 'HonkyTonk', type: 'Regular', msb: 0, lsb: 112, prg: 4 },
      { name: 'CP80', type: 'Regular', msb: 0, lsb: 113, prg: 3 },
      { name: 'Harpsichord', type: 'Live!', msb: 0, lsb: 112, prg: 7 },
      { name: 'GrandHarpsi', type: 'Live!', msb: 0, lsb: 113, prg: 7 },
    ],
  },
  {
    category: 'E.Piano',
    voices: [
      { name: 'SparkleStack', type: 'Cool!', msb: 0, lsb: 121, prg: 6 },
      { name: 'SweetDX', type: 'Cool!', msb: 104, lsb: 0, prg: 6 },
      { name: 'DX Dynamics', type: 'Cool!', msb: 0, lsb: 123, prg: 6 },
      { name: 'GalaxyEP', type: 'Cool!', msb: 0, lsb: 114, prg: 5 },
      { name: 'BalladDX', type: 'Cool!', msb: 0, lsb: 124, prg: 6 },
      { name: 'SuitcaseEP', type: 'Cool!', msb: 0, lsb: 118, prg: 5 },
      { name: 'ElectricPiano', type: 'Cool!', msb: 0, lsb: 119, prg: 5 },
      { name: 'TremoloEP', type: 'Cool!', msb: 0, lsb: 113, prg: 5 },
      { name: 'StageEP', type: 'Regular', msb: 0, lsb: 117, prg: 5 },
      { name: 'VintageEP', type: 'Regular', msb: 0, lsb: 116, prg: 5 },
      { name: 'HyperTines', type: 'Regular', msb: 0, lsb: 113, prg: 6 },
      { name: 'VenusEP', type: 'Regular', msb: 0, lsb: 114, prg: 6 },
      { name: 'SuperDX', type: 'Regular', msb: 0, lsb: 117, prg: 6 },
      { name: 'PolarisEP', type: 'Regular', msb: 0, lsb: 115, prg: 5 },
      { name: 'DX Modern', type: 'Regular', msb: 0, lsb: 112, prg: 6 },
      { name: 'NewTines', type: 'Regular', msb: 0, lsb: 116, prg: 6 },
      { name: 'SmoothTine', type: 'Regular', msb: 0, lsb: 119, prg: 6 },
      { name: 'Clavi', type: 'Regular', msb: 0, lsb: 112, prg: 8 },
      { name: 'WahClavi', type: 'Regular', msb: 0, lsb: 113, prg: 8 },
      { name: 'PhaseClavi', type: 'Regular', msb: 0, lsb: 115, prg: 8 },
    ],
  },
  {
    category: 'Strings',
    voices: [
      { name: 'ConcertStrings', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 50 },
      { name: 'StudioStrings', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 49 },
      { name: 'Spiccato', type: 'Regular', msb: 0, lsb: 120, prg: 49 },
      { name: 'Pizzicato', type: 'Live!', msb: 0, lsb: 113, prg: 46 },
      { name: 'TremoloStrings', type: 'Regular', msb: 0, lsb: 113, prg: 45 },
      { name: 'Violin', type: 'Sweet!', msb: 0, lsb: 113, prg: 41 },
      { name: 'DiscoStrings1', type: 'Regular', msb: 0, lsb: 123, prg: 50 },
      { name: 'DiscoStrings2', type: 'Regular', msb: 0, lsb: 124, prg: 50 },
      { name: 'MovieStrings', type: 'Regular', msb: 0, lsb: 123, prg: 49 },
      { name: 'Strings', type: 'Live!', msb: 0, lsb: 117, prg: 50 },
      { name: 'Strings p', type: 'Regular', msb: 0, lsb: 117, prg: 49 },
      { name: 'Strings mf', type: 'Regular', msb: 0, lsb: 118, prg: 49 },
      { name: 'Strings f', type: 'Regular', msb: 0, lsb: 119, prg: 49 },
      { name: 'DynamicStrings', type: 'Regular', msb: 0, lsb: 124, prg: 49 },
      { name: 'TremoloBowing', type: 'S.Articulation!', msb: 8, lsb: 34, prg: 49 },
      { name: 'Allegro', type: 'Live!', msb: 0, lsb: 122, prg: 50 },
      { name: 'Tutti', type: 'Regular', msb: 0, lsb: 120, prg: 50 },
      { name: 'OrchestraHit', type: 'Regular', msb: 0, lsb: 112, prg: 56 },
      { name: 'Spiccato', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 49 },
      { name: 'Harp', type: 'Regular', msb: 0, lsb: 112, prg: 47 },
      { name: 'Watariyat', type: 'Regular', msb: 0, lsb: 125, prg: 49 },
      { name: 'Er Hu', type: 'Regular', msb: 0, lsb: 113, prg: 111 },
      { name: 'Kanoun', type: 'Regular', msb: 0, lsb: 113, prg: 108 },
      { name: 'Oud', type: 'Regular', msb: 0, lsb: 113, prg: 106 },
      { name: 'Pi Pa', type: 'Regular', msb: 0, lsb: 119, prg: 106 },
      { name: 'Sitar1', type: 'Regular', msb: 104, lsb: 0, prg: 105 },
      { name: 'Sitar2', type: 'Regular', msb: 0, lsb: 113, prg: 105 },
      { name: 'Banjo', type: 'Regular', msb: 0, lsb: 112, prg: 106 },
      { name: 'Koto', type: 'Regular', msb: 0, lsb: 112, prg: 108 },
      { name: 'Shamisen', type: 'Regular', msb: 0, lsb: 112, prg: 107 },
      { name: 'SynthStrings1', type: 'Regular', msb: 0, lsb: 112, prg: 51 },
      { name: 'SynthStrings2', type: 'Regular', msb: 0, lsb: 113, prg: 51 },
      { name: 'OberStrings', type: 'Regular', msb: 0, lsb: 113, prg: 52 },
      { name: 'SoloViolin', type: 'Regular', msb: 0, lsb: 112, prg: 41 },
      { name: 'Viola', type: 'Regular', msb: 0, lsb: 112, prg: 42 },
      { name: 'Cello', type: 'Regular', msb: 0, lsb: 112, prg: 43 },
      { name: 'Contrabass', type: 'Regular', msb: 0, lsb: 112, prg: 44 },
      { name: 'Fiddle', type: 'Regular', msb: 0, lsb: 112, prg: 111 },
      { name: 'ChamberStrings', type: 'Regular', msb: 0, lsb: 112, prg: 50 },
      { name: 'Hackbrett', type: 'Regular', msb: 0, lsb: 113, prg: 47 },
      { name: 'SmallStrings', type: 'MegaVoice', msb: 8, lsb: 0, prg: 49 },
      { name: 'LargeStrings', type: 'MegaVoice', msb: 8, lsb: 0, prg: 50 },
    ],
  },
  {
    category: 'Guitar&Bass',
    voices: [
      { name: 'ConcertGuitar', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 1 },
      { name: 'SteelGuitar', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 2 },
      { name: 'FlamencoGtr', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 1 },
      { name: '12StringGtr', type: 'Live!', msb: 0, lsb: 113, prg: 26 },
      { name: 'PedalSteel', type: 'S.Articulation!', msb: 8, lsb: 36, prg: 4 },
      { name: 'WarmSolid', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 4 },
      { name: 'CleanSolid', type: 'S.Articulation!', msb: 8, lsb: 34, prg: 4 },
      { name: 'GuitarHero', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 6 },
      { name: "70'sSolidGtr", type: 'S.Articulation!', msb: 8, lsb: 38, prg: 4 },
      { name: 'HeavyRock', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 5 },
      { name: 'Mandolin', type: 'Sweet!', msb: 0, lsb: 114, prg: 26 },
      { name: 'NylonGuitar', type: 'S.Articulation!', msb: 8, lsb: 34, prg: 1 },
      { name: 'FolkGuitar', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 2 },
      { name: 'DynamicNylon', type: 'Regular', msb: 0, lsb: 116, prg: 25 },
      { name: 'DynamicSteel', type: 'Live!', msb: 0, lsb: 116, prg: 26 },
      { name: 'HalfDrive', type: 'S.Articulation!', msb: 8, lsb: 37, prg: 4 },
      { name: 'VintageLead', type: 'Cool!', msb: 0, lsb: 125, prg: 28 },
      { name: 'BluesGuitar', type: 'Cool!', msb: 0, lsb: 117, prg: 30 },
      { name: 'WarmElectric', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 4 },
      { name: 'CleanElectric', type: 'S.Articulation!', msb: 8, lsb: 35, prg: 4 },
      { name: 'SlideNylon', type: 'Regular', msb: 0, lsb: 117, prg: 25 },
      { name: 'SlideSteel', type: 'Live!', msb: 0, lsb: 118, prg: 26 },
      { name: 'SlideSolid', type: 'Cool!', msb: 0, lsb: 110, prg: 28 },
      { name: 'SlideClean', type: 'Cool!', msb: 0, lsb: 117, prg: 29 },
      { name: 'PedalSteel', type: 'Regular', msb: 0, lsb: 115, prg: 28 },
      { name: 'AlohaGuitar', type: 'Regular', msb: 0, lsb: 118, prg: 27 },
      { name: 'HardFlamenco', type: 'Regular', msb: 0, lsb: 118, prg: 25 },
      { name: 'JazzSoloGtr', type: 'Cool!', msb: 0, lsb: 116, prg: 27 },
      { name: 'ClassicalGtr', type: 'Regular', msb: 0, lsb: 115, prg: 25 },
      { name: 'SteelGuitar', type: 'Live!', msb: 0, lsb: 117, prg: 26 },
      { name: 'TremoloSolid', type: 'Cool!', msb: 0, lsb: 111, prg: 28 },
      { name: 'ChorusSolid', type: 'Cool!', msb: 0, lsb: 107, prg: 28 },
      { name: 'BalladSolid', type: 'Cool!', msb: 0, lsb: 109, prg: 28 },
      { name: 'DynamicMute', type: 'Cool!', msb: 0, lsb: 118, prg: 29 },
      { name: 'ElectricGtr', type: 'Cool!', msb: 0, lsb: 114, prg: 29 },
      { name: 'PowerLead', type: 'Cool!', msb: 0, lsb: 115, prg: 31 },
      { name: 'Feedbacker', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 5 },
      { name: 'CleanGuitar', type: 'Cool!', msb: 0, lsb: 112, prg: 28 },
      { name: 'SlapSolid', type: 'Cool!', msb: 0, lsb: 108, prg: 28 },
      { name: 'FunkGuitar', type: 'Cool!', msb: 0, lsb: 116, prg: 29 },
      { name: 'JazzGuitar', type: 'Cool!', msb: 0, lsb: 115, prg: 27 },
      { name: 'VintageOpen', type: 'Regular', msb: 0, lsb: 123, prg: 28 },
      { name: 'VintageStrum', type: 'Regular', msb: 0, lsb: 126, prg: 28 },
      { name: 'VintageAmp', type: 'Regular', msb: 0, lsb: 115, prg: 30 },
      { name: 'VintageMutedGt', type: 'Regular', msb: 0, lsb: 115, prg: 29 },
      { name: 'NylonMute', type: 'Regular', msb: 0, lsb: 119, prg: 25 },
      { name: 'SteelMute', type: 'Live!', msb: 0, lsb: 120, prg: 26 },
      { name: 'HeavyStack', type: 'Regular', msb: 0, lsb: 114, prg: 31 },
      { name: 'CrunchGuitar', type: 'Regular', msb: 0, lsb: 113, prg: 31 },
      { name: 'MutedGuitar', type: 'Cool!', msb: 0, lsb: 119, prg: 29 },
      { name: 'OctaveGuitar', type: 'Regular', msb: 0, lsb: 113, prg: 27 },
      { name: 'NylonGuitar', type: 'MegaVoice', msb: 8, lsb: 0, prg: 1 },
      { name: 'SteelGuitar', type: 'MegaVoice', msb: 8, lsb: 0, prg: 2 },
      { name: '12StringGtr', type: 'MegaVoice', msb: 8, lsb: 1, prg: 3 },
      { name: 'HiStringGtr', type: 'MegaVoice', msb: 8, lsb: 0, prg: 3 },
      { name: 'SolidGuitar1', type: 'MegaVoice', msb: 8, lsb: 1, prg: 4 },
      { name: 'SolidGuitar2', type: 'MegaVoice', msb: 8, lsb: 2, prg: 4 },
      { name: 'CleanGuitar', type: 'MegaVoice', msb: 8, lsb: 0, prg: 4 },
      { name: 'OverdriveGtr', type: 'MegaVoice', msb: 8, lsb: 0, prg: 5 },
      { name: 'DistortionGtr', type: 'MegaVoice', msb: 8, lsb: 0, prg: 6 },
      { name: 'ElectricBass', type: 'Cool!', msb: 0, lsb: 114, prg: 34 },
      { name: 'AcousticBass', type: 'Regular', msb: 0, lsb: 112, prg: 33 },
      { name: 'DynoPickBass', type: 'Cool!', msb: 0, lsb: 113, prg: 35 },
      { name: 'FretlessBass', type: 'Cool!', msb: 0, lsb: 112, prg: 36 },
      { name: 'SlapBass', type: 'Regular', msb: 0, lsb: 112, prg: 37 },
      { name: 'LoBass', type: 'Regular', msb: 104, lsb: 0, prg: 40 },
      { name: 'DarkBass', type: 'Regular', msb: 104, lsb: 1, prg: 40 },
      { name: 'MoonBass', type: 'Regular', msb: 104, lsb: 0, prg: 39 },
      { name: 'KickBass', type: 'Regular', msb: 104, lsb: 1, prg: 39 },
      { name: 'ClubBass', type: 'Regular', msb: 104, lsb: 2, prg: 39 },
      { name: 'MellowFinger', type: 'Regular', msb: 0, lsb: 112, prg: 34 },
      { name: 'RockBass', type: 'Regular', msb: 0, lsb: 114, prg: 35 },
      { name: 'SuperFretless', type: 'Regular', msb: 0, lsb: 113, prg: 36 },
      { name: 'PickBass', type: 'Regular', msb: 0, lsb: 112, prg: 35 },
      { name: 'FusionBass', type: 'Regular', msb: 0, lsb: 113, prg: 37 },
      { name: 'FatPulse', type: 'Regular', msb: 104, lsb: 2, prg: 40 },
      { name: 'WazzoSaw', type: 'Regular', msb: 104, lsb: 3, prg: 81 },
      { name: 'DeepPoint', type: 'Regular', msb: 104, lsb: 3, prg: 39 },
      { name: 'TightBass', type: 'Regular', msb: 104, lsb: 3, prg: 40 },
      { name: 'Competitor', type: 'Regular', msb: 104, lsb: 4, prg: 39 },
      { name: '1o1Sub', type: 'Regular', msb: 104, lsb: 5, prg: 39 },
      { name: 'LittleBassSynth', type: 'Regular', msb: 104, lsb: 6, prg: 39 },
      { name: 'TeknoBass', type: 'Regular', msb: 104, lsb: 7, prg: 39 },
      { name: 'PercPunch', type: 'Regular', msb: 104, lsb: 8, prg: 39 },
      { name: 'SquareBass', type: 'Regular', msb: 104, lsb: 4, prg: 40 },
      { name: 'TranceBass', type: 'Regular', msb: 104, lsb: 9, prg: 39 },
      { name: 'SubCutBass', type: 'Regular', msb: 104, lsb: 5, prg: 40 },
      { name: 'DynoAcidBass', type: 'Regular', msb: 104, lsb: 10, prg: 39 },
      { name: 'MiniSub', type: 'Regular', msb: 104, lsb: 6, prg: 40 },
      { name: 'FatSineRes', type: 'Regular', msb: 104, lsb: 11, prg: 39 },
      { name: 'BalladBass', type: 'Regular', msb: 104, lsb: 7, prg: 40 },
      { name: 'VeloMaster', type: 'Regular', msb: 104, lsb: 17, prg: 82 },
      { name: 'SubBass', type: 'Regular', msb: 0, lsb: 114, prg: 40 },
      { name: 'HardBass', type: 'Regular', msb: 0, lsb: 114, prg: 39 },
      { name: 'ResoBass', type: 'Regular', msb: 0, lsb: 112, prg: 39 },
      { name: 'HouseBass', type: 'Regular', msb: 0, lsb: 116, prg: 39 },
      { name: 'BigDrone', type: 'Regular', msb: 0, lsb: 118, prg: 39 },
      { name: 'FunkBass', type: 'Regular', msb: 0, lsb: 112, prg: 38 },
      { name: 'TB Bass', type: 'Regular', msb: 0, lsb: 117, prg: 40 },
      { name: 'Bass&Cymbal', type: 'Regular', msb: 0, lsb: 114, prg: 33 },
      { name: 'AcousticBass', type: 'MegaVoice', msb: 8, lsb: 0, prg: 17 },
      { name: 'ElectricBass', type: 'MegaVoice', msb: 8, lsb: 0, prg: 18 },
      { name: 'PickBass', type: 'MegaVoice', msb: 8, lsb: 0, prg: 19 },
      { name: 'FretlessBass', type: 'MegaVoice', msb: 8, lsb: 0, prg: 20 },
    ],
  },
  {
    category: 'Saxophone',
    voices: [
      { name: 'Saxophone', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 83 },
      { name: 'BigBandSax', type: 'S.Articulation!', msb: 8, lsb: 35, prg: 83 },
      { name: 'RockSax', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 83 },
      { name: 'SopranoSax', type: 'Sweet!', msb: 0, lsb: 113, prg: 65 },
      { name: 'SaxSection', type: 'Live!', msb: 0, lsb: 116, prg: 67 },
      { name: 'PopTenor', type: 'Sweet!', msb: 0, lsb: 127, prg: 67 },
      { name: 'BalladTenor', type: 'Sweet!', msb: 0, lsb: 126, prg: 67 },
      { name: 'JazzTenor', type: 'Sweet!', msb: 0, lsb: 125, prg: 67 },
      { name: 'AltoSax', type: 'Sweet!', msb: 0, lsb: 114, prg: 66 },
      { name: 'TenorSax', type: 'Sweet!', msb: 0, lsb: 117, prg: 67 },
      { name: 'GrowlSax', type: 'Sweet!', msb: 0, lsb: 111, prg: 67 },
      { name: 'SaxSectionSoft', type: 'Live!', msb: 0, lsb: 121, prg: 67 },
      { name: 'SaxSectionHard', type: 'Live!', msb: 0, lsb: 122, prg: 67 },
      { name: 'SaxAppeal', type: 'Live!', msb: 0, lsb: 123, prg: 67 },
      { name: 'BaritoneSax', type: 'Regular', msb: 0, lsb: 112, prg: 68 },
      { name: 'BigBandSaxes', type: 'Regular', msb: 0, lsb: 110, prg: 67 },
      { name: 'BigBandUnison', type: 'Regular', msb: 0, lsb: 109, prg: 67 },
      { name: 'BigBandOctave', type: 'Regular', msb: 0, lsb: 108, prg: 67 },
      { name: 'Moonlight', type: 'Regular', msb: 0, lsb: 115, prg: 72 },
      { name: 'BalladSection', type: 'Regular', msb: 0, lsb: 119, prg: 67 },
      { name: 'TenorSax', type: 'MegaVoice', msb: 8, lsb: 0, prg: 83 },
    ],
  },
  {
    category: 'Flute&Woodwind',
    voices: [
      { name: 'Flute', type: 'Sweet!', msb: 0, lsb: 114, prg: 74 },
      { name: 'Clarinet', type: 'Sweet!', msb: 0, lsb: 114, prg: 72 },
      { name: 'Oboe', type: 'Sweet!', msb: 0, lsb: 113, prg: 69 },
      { name: 'EnglishHorn', type: 'Regular', msb: 0, lsb: 112, prg: 70 },
      { name: 'Bassoon', type: 'Regular', msb: 0, lsb: 112, prg: 71 },
      { name: 'PanFlute', type: 'Sweet!', msb: 0, lsb: 113, prg: 76 },
      { name: 'ClassicalFlute', type: 'Sweet!', msb: 0, lsb: 115, prg: 74 },
      { name: 'Nay', type: 'Regular', msb: 0, lsb: 114, prg: 78 },
      { name: 'Di Zi', type: 'Regular', msb: 0, lsb: 118, prg: 74 },
      { name: 'Sheng', type: 'Regular', msb: 0, lsb: 116, prg: 110 },
      { name: 'Piccolo', type: 'Regular', msb: 0, lsb: 112, prg: 73 },
      { name: 'Flute', type: 'Regular', msb: 0, lsb: 112, prg: 74 },
      { name: 'Clarinet', type: 'Regular', msb: 0, lsb: 112, prg: 72 },
      { name: 'Oboe', type: 'Regular', msb: 0, lsb: 112, prg: 69 },
      { name: 'FluteEnsemble', type: 'Regular', msb: 0, lsb: 116, prg: 74 },
      { name: 'Whistle', type: 'Regular', msb: 0, lsb: 112, prg: 79 },
      { name: 'Shakuhachi', type: 'Regular', msb: 0, lsb: 112, prg: 78 },
      { name: 'Bagpipe', type: 'Regular', msb: 0, lsb: 112, prg: 110 },
      { name: 'Recorder', type: 'Regular', msb: 0, lsb: 112, prg: 75 },
      { name: 'Ocarina', type: 'Regular', msb: 0, lsb: 112, prg: 80 },
      { name: 'PanFlute', type: 'Regular', msb: 0, lsb: 113, prg: 74 },
      { name: 'EthnicFlute', type: 'Regular', msb: 0, lsb: 112, prg: 76 },
    ],
  },
  {
    category: 'Organ',
    voices: [
      { name: 'JazzRotary', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 114 },
      { name: 'CurvedBars', type: 'Cool!', msb: 0, lsb: 121, prg: 17 },
      { name: 'EvenBars', type: 'Cool!', msb: 0, lsb: 111, prg: 17 },
      { name: 'VintageFast', type: 'Cool!', msb: 0, lsb: 127, prg: 17 },
      { name: 'RotorOrgan', type: 'Cool!', msb: 0, lsb: 117, prg: 19 },
      { name: 'JazzOrgan', type: 'Cool!', msb: 0, lsb: 117, prg: 17 },
      { name: 'RockRotary', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 114 },
      { name: 'Hold It Fast', type: 'Cool!', msb: 0, lsb: 111, prg: 18 },
      { name: 'R&B Tremolo', type: 'Cool!', msb: 0, lsb: 111, prg: 19 },
      { name: 'Organ', type: 'Cool!', msb: 0, lsb: 118, prg: 19 },
      { name: 'JazzSlow', type: 'Cool!', msb: 0, lsb: 126, prg: 18 },
      { name: 'JazzFast', type: 'Cool!', msb: 0, lsb: 127, prg: 18 },
      { name: 'TwoChannels', type: 'Cool!', msb: 0, lsb: 109, prg: 18 },
      { name: 'FullRocker', type: 'Cool!', msb: 0, lsb: 115, prg: 19 },
      { name: 'EuroOrgan', type: 'Regular', msb: 0, lsb: 118, prg: 17 },
      { name: 'OrganAccomp1', type: 'Regular', msb: 0, lsb: 108, prg: 18 },
      { name: 'OrganAccomp2', type: 'Regular', msb: 0, lsb: 107, prg: 18 },
      { name: 'OrganAccomp3', type: 'Regular', msb: 0, lsb: 106, prg: 18 },
      { name: 'OrganAccomp4', type: 'Regular', msb: 0, lsb: 105, prg: 18 },
      { name: 'OrganAccomp5', type: 'Regular', msb: 0, lsb: 104, prg: 18 },
      { name: 'FullTheatre', type: 'Regular', msb: 0, lsb: 127, prg: 19 },
      { name: 'SweetTheatre', type: 'Regular', msb: 0, lsb: 126, prg: 19 },
      { name: 'BallroomOrgan', type: 'Regular', msb: 0, lsb: 115, prg: 4 },
      { name: 'Harmonium Double', type: 'Regular', msb: 0, lsb: 114, prg: 21 },
      { name: 'Harmonium Triple', type: 'Regular', msb: 0, lsb: 115, prg: 21 },
      { name: 'ChapelOrgan1', type: 'Regular', msb: 0, lsb: 113, prg: 20 },
      { name: 'ChapelOrgan2', type: 'Regular', msb: 0, lsb: 114, prg: 20 },
      { name: 'ChapelOrgan3', type: 'Regular', msb: 0, lsb: 115, prg: 20 },
      { name: 'PipeOrgan', type: 'Regular', msb: 0, lsb: 112, prg: 20 },
      { name: 'Tibia 16&4 Acmp', type: 'Regular', msb: 0, lsb: 114, prg: 17 },
      { name: 'Tibia Full Acmp', type: 'Regular', msb: 0, lsb: 114, prg: 18 },
      { name: 'MellowDraw', type: 'Regular', msb: 0, lsb: 115, prg: 18 },
    ],
  },
  {
    category: 'Trumpet',
    voices: [
      { name: 'Trumpet', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 65 },
      { name: 'SilverTrumpet', type: 'S.Articulation!', msb: 8, lsb: 33, prg: 65 },
      { name: 'GoldenTrumpet', type: 'S.Articulation!', msb: 8, lsb: 34, prg: 65 },
      { name: 'BigBandTrumpet', type: 'S.Articulation!', msb: 8, lsb: 37, prg: 65 },
      { name: 'TrumpetFall', type: 'S.Articulation!', msb: 8, lsb: 38, prg: 65 },
      { name: 'Cornet', type: 'Sweet!', msb: 0, lsb: 119, prg: 57 },
      { name: 'FlugelHorn', type: 'Sweet!', msb: 0, lsb: 118, prg: 57 },
      { name: 'MutedTrumpet', type: 'Sweet!', msb: 0, lsb: 114, prg: 60 },
      { name: 'Trumpet', type: 'Sweet!', msb: 0, lsb: 115, prg: 57 },
      { name: 'Trombone', type: 'Sweet!', msb: 0, lsb: 117, prg: 58 },
      { name: 'TrumpetShake', type: 'S.Articulation!', msb: 8, lsb: 35, prg: 65 },
      { name: 'GoldenTrumpet', type: 'Sweet!', msb: 0, lsb: 122, prg: 57 },
      { name: 'SilverTrumpet', type: 'Sweet!', msb: 0, lsb: 121, prg: 57 },
      { name: 'MellowTrumpet', type: 'Sweet!', msb: 0, lsb: 120, prg: 57 },
      { name: 'BaritoneHorn', type: 'Regular', msb: 0, lsb: 113, prg: 59 },
      { name: 'BaritoneHit', type: 'Regular', msb: 0, lsb: 114, prg: 59 },
      { name: 'AlpBass', type: 'Regular', msb: 0, lsb: 113, prg: 34 },
      { name: 'Tuba', type: 'Regular', msb: 0, lsb: 112, prg: 59 },
      { name: 'Trumpet', type: 'MegaVoice', msb: 8, lsb: 0, prg: 65 },
    ],
  },
  {
    category: 'Brass',
    voices: [
      { name: 'BigBandBrass', type: 'S.Articulation!', msb: 8, lsb: 37, prg: 57 },
      { name: 'SmoothBrass', type: 'S.Articulation!', msb: 8, lsb: 36, prg: 57 },
      { name: 'DynamicBrass', type: 'Regular', msb: 0, lsb: 127, prg: 62 },
      { name: 'PowerBrass', type: 'Regular', msb: 0, lsb: 121, prg: 63 },
      { name: 'AccentBrass', type: 'Regular', msb: 0, lsb: 109, prg: 62 },
      { name: 'FrenchHorns', type: 'Live!', msb: 0, lsb: 112, prg: 61 },
      { name: 'SymphonyBrass', type: 'Regular', msb: 0, lsb: 119, prg: 61 },
      { name: 'Brass p', type: 'Regular', msb: 0, lsb: 111, prg: 62 },
      { name: 'Brass mf', type: 'Regular', msb: 0, lsb: 110, prg: 62 },
      { name: 'Brass f', type: 'Regular', msb: 0, lsb: 108, prg: 62 },
      { name: 'BrassFalls f', type: 'S.Articulation!', msb: 8, lsb: 34, prg: 57 },
      { name: 'BrassFalls mf', type: 'S.Articulation!', msb: 8, lsb: 35, prg: 57 },
      { name: 'BrassBand', type: 'Regular', msb: 0, lsb: 123, prg: 57 },
      { name: 'SoftHorns', type: 'Regular', msb: 0, lsb: 117, prg: 61 },
      { name: 'SoftTrombones', type: 'Regular', msb: 0, lsb: 118, prg: 61 },
      { name: 'BrassShake', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 57 },
      { name: 'AccentFalls', type: 'S.Articulation!', msb: 8, lsb: 38, prg: 57 },
      { name: 'Sforzando', type: 'Regular', msb: 0, lsb: 105, prg: 62 },
      { name: 'SforzandoFall', type: 'Regular', msb: 0, lsb: 107, prg: 62 },
      { name: 'SymphonyHorns', type: 'Live!', msb: 0, lsb: 115, prg: 61 },
      { name: 'BrassDynamics', type: 'Regular', msb: 0, lsb: 106, prg: 62 },
      { name: 'PopBrass', type: 'Live!', msb: 0, lsb: 117, prg: 63 },
      { name: 'HyperBrass', type: 'Live!', msb: 0, lsb: 118, prg: 63 },
      { name: 'SmallBrass', type: 'Live!', msb: 0, lsb: 120, prg: 61 },
      { name: 'OctaveBrass', type: 'Live!', msb: 0, lsb: 116, prg: 63 },
      { name: 'ThinthBrass', type: 'Regular', msb: 104, lsb: 0, prg: 63 },
      { name: 'BrassProfit', type: 'Regular', msb: 104, lsb: 1, prg: 63 },
      { name: 'SlowPWMBrass', type: 'Regular', msb: 104, lsb: 2, prg: 63 },
      { name: 'FastPWMBrass', type: 'Regular', msb: 104, lsb: 6, prg: 63 },
      { name: 'OberBrass', type: 'Regular', msb: 0, lsb: 113, prg: 64 },
      { name: 'SoftVeloBrass', type: 'Regular', msb: 0, lsb: 120, prg: 63 },
      { name: "80'sBrass", type: 'Regular', msb: 0, lsb: 113, prg: 63 },
      { name: 'AnalogBrass', type: 'Regular', msb: 0, lsb: 112, prg: 64 },
      { name: 'SoftAnalog', type: 'Regular', msb: 0, lsb: 114, prg: 64 },
      { name: 'FunkyAnalog', type: 'Regular', msb: 0, lsb: 115, prg: 63 },
      { name: 'TechnoBrass', type: 'Regular', msb: 0, lsb: 114, prg: 63 },
      { name: 'OberHorns', type: 'Regular', msb: 0, lsb: 115, prg: 64 },
      { name: 'FatSynthBrass', type: 'Regular', msb: 0, lsb: 116, prg: 64 },
      { name: 'BallroomBrass', type: 'Regular', msb: 0, lsb: 113, prg: 60 },
      { name: 'Brass', type: 'MegaVoice', msb: 8, lsb: 0, prg: 57 },
    ],
  },
  {
    category: 'Accordion',
    voices: [
      { name: 'FrenchMusette', type: 'Regular', msb: 0, lsb: 119, prg: 22 },
      { name: 'MasterAccord', type: 'Regular', msb: 0, lsb: 118, prg: 22 },
      { name: 'JazzAccordion', type: 'Regular', msb: 0, lsb: 120, prg: 22 },
      { name: 'TangoAccordion', type: 'Regular', msb: 0, lsb: 114, prg: 24 },
      { name: 'Steirisch', type: 'Regular', msb: 0, lsb: 117, prg: 22 },
      { name: 'Harmonica', type: 'Sweet!', msb: 0, lsb: 112, prg: 23 },
      { name: 'ModernHarp', type: 'Regular', msb: 0, lsb: 113, prg: 23 },
      { name: 'BluesHarp', type: 'Regular', msb: 0, lsb: 114, prg: 23 },
      { name: 'Bandoneon', type: 'Regular', msb: 0, lsb: 113, prg: 24 },
      { name: 'Musette', type: 'Regular', msb: 0, lsb: 112, prg: 22 },
      { name: 'MasterBass', type: 'Regular', msb: 0, lsb: 122, prg: 22 },
      { name: 'MusetteBass', type: 'Regular', msb: 0, lsb: 123, prg: 22 },
      { name: 'AccordionBass', type: 'Regular', msb: 0, lsb: 121, prg: 22 },
      { name: 'TangoBass', type: 'Regular', msb: 0, lsb: 115, prg: 24 },
    ],
  },
  {
    category: 'Choir&Pad',
    voices: [
      { name: 'GospelVoices', type: 'Live!', msb: 0, lsb: 116, prg: 53 },
      { name: 'Humming', type: 'Live!', msb: 0, lsb: 118, prg: 53 },
      { name: 'HahChoir', type: 'Regular', msb: 0, lsb: 114, prg: 53 },
      { name: 'SweetHeaven', type: 'Regular', msb: 0, lsb: 118, prg: 89 },
      { name: 'DreamHeaven', type: 'Regular', msb: 0, lsb: 121, prg: 89 },
      { name: 'Mmh', type: 'Live!', msb: 0, lsb: 117, prg: 53 },
      { name: 'GothicVox', type: 'Regular', msb: 0, lsb: 113, prg: 54 },
      { name: 'BellHeaven', type: 'Regular', msb: 0, lsb: 119, prg: 89 },
      { name: 'PanHeaven', type: 'Regular', msb: 0, lsb: 120, prg: 89 },
      { name: 'ProHeaven', type: 'Regular', msb: 0, lsb: 122, prg: 89 },
      { name: 'CrossPhase', type: 'Regular', msb: 104, lsb: 1, prg: 102 },
      { name: 'GalaxyPad', type: 'Regular', msb: 104, lsb: 3, prg: 89 },
      { name: 'NightMotion', type: 'Regular', msb: 104, lsb: 4, prg: 89 },
      { name: 'MorningDew', type: 'Regular', msb: 104, lsb: 0, prg: 95 },
      { name: 'Aerosphere', type: 'Regular', msb: 104, lsb: 1, prg: 95 },
      { name: 'NewAtmosphere', type: 'Regular', msb: 104, lsb: 4, prg: 90 },
      { name: 'VPSoft', type: 'Regular', msb: 104, lsb: 0, prg: 90 },
      { name: 'HotSwell', type: 'Regular', msb: 104, lsb: 2, prg: 96 },
      { name: 'DarkFatSaw', type: 'Regular', msb: 104, lsb: 2, prg: 90 },
      { name: 'VaporPad', type: 'Regular', msb: 104, lsb: 1, prg: 90 },
      { name: 'SpaceRider', type: 'Regular', msb: 104, lsb: 1, prg: 96 },
      { name: 'PearlsPad', type: 'Regular', msb: 104, lsb: 2, prg: 89 },
      { name: 'BreathPad', type: 'Regular', msb: 104, lsb: 0, prg: 92 },
      { name: 'NobleMan', type: 'Regular', msb: 104, lsb: 1, prg: 89 },
      { name: 'DouxFlange', type: 'Regular', msb: 104, lsb: 3, prg: 96 },
      { name: 'LightPad', type: 'Regular', msb: 104, lsb: 2, prg: 52 },
      { name: 'ButterStrings', type: 'Regular', msb: 104, lsb: 2, prg: 51 },
      { name: 'MediumTunePad', type: 'Regular', msb: 104, lsb: 0, prg: 51 },
      { name: 'NylonPad', type: 'Regular', msb: 104, lsb: 0, prg: 100 },
      { name: 'DarkLight', type: 'Regular', msb: 104, lsb: 3, prg: 90 },
      { name: 'AnaDayz', type: 'Regular', msb: 104, lsb: 3, prg: 52 },
      { name: 'BrightPadTrance', type: 'Regular', msb: 104, lsb: 4, prg: 91 },
      { name: 'OctStrings', type: 'Regular', msb: 104, lsb: 4, prg: 51 },
      { name: 'ChillinChords', type: 'Regular', msb: 104, lsb: 6, prg: 52 },
      { name: 'BrightPopPad', type: 'Regular', msb: 104, lsb: 3, prg: 51 },
      { name: 'PremiumPad', type: 'Regular', msb: 104, lsb: 0, prg: 52 },
      { name: 'SoftEnsemble', type: 'Regular', msb: 104, lsb: 1, prg: 51 },
      { name: "80'sPad", type: 'Regular', msb: 104, lsb: 1, prg: 52 },
      { name: 'BrightPadClassic', type: 'Regular', msb: 104, lsb: 3, prg: 91 },
      { name: 'AmbientPad', type: 'Regular', msb: 104, lsb: 0, prg: 89 },
      { name: 'BrightFatSaw', type: 'Regular', msb: 104, lsb: 5, prg: 91 },
      { name: 'TranceMW', type: 'Regular', msb: 104, lsb: 0, prg: 96 },
      { name: 'EarlyDigital', type: 'Regular', msb: 104, lsb: 0, prg: 94 },
      { name: 'Bellsphere', type: 'Regular', msb: 104, lsb: 5, prg: 89 },
      { name: 'SixthSense', type: 'Regular', msb: 104, lsb: 2, prg: 102 },
      { name: 'PercPad', type: 'Regular', msb: 104, lsb: 0, prg: 102 },
      { name: 'SuperDarkPad', type: 'Regular', msb: 0, lsb: 119, prg: 90 },
      { name: 'AnalogPad', type: 'Regular', msb: 0, lsb: 120, prg: 90 },
      { name: 'DarkAngelPad', type: 'Regular', msb: 0, lsb: 121, prg: 90 },
      { name: 'LitePad', type: 'Regular', msb: 0, lsb: 122, prg: 90 },
      { name: 'PopPad', type: 'Regular', msb: 0, lsb: 112, prg: 91 },
      { name: 'GloriousPhase', type: 'Regular', msb: 0, lsb: 114, prg: 91 },
      { name: 'AnalogSwell', type: 'Regular', msb: 0, lsb: 119, prg: 96 },
      { name: 'Skydiver', type: 'Regular', msb: 0, lsb: 112, prg: 102 },
      { name: 'HipaStrings', type: 'Regular', msb: 0, lsb: 114, prg: 96 },
      { name: 'BrightSawPad', type: 'Regular', msb: 0, lsb: 113, prg: 91 },
      { name: 'BigOctavePad', type: 'Regular', msb: 0, lsb: 115, prg: 91 },
      { name: 'GoldenAge', type: 'Regular', msb: 0, lsb: 115, prg: 89 },
      { name: 'Solaris', type: 'Regular', msb: 0, lsb: 114, prg: 95 },
      { name: 'Insomnia', type: 'Regular', msb: 0, lsb: 113, prg: 95 },
      { name: 'Mediterrain', type: 'Regular', msb: 0, lsb: 114, prg: 100 },
      { name: 'OberSweep', type: 'Regular', msb: 0, lsb: 115, prg: 96 },
      { name: 'TimeTravel', type: 'Regular', msb: 0, lsb: 116, prg: 89 },
      { name: 'Bubblespace', type: 'Regular', msb: 0, lsb: 113, prg: 102 },
      { name: 'MagicBell', type: 'S.Articulation!', msb: 8, lsb: 32, prg: 121 },
      { name: 'MellowPad', type: 'Regular', msb: 0, lsb: 117, prg: 96 },
      { name: 'NeoWarmPad', type: 'Regular', msb: 0, lsb: 115, prg: 90 },
      { name: 'CyberPad', type: 'Regular', msb: 0, lsb: 113, prg: 100 },
      { name: 'BrightOber', type: 'Regular', msb: 0, lsb: 113, prg: 96 },
      { name: 'DarkPad', type: 'Regular', msb: 0, lsb: 118, prg: 96 },
    ],
  },
  {
    category: 'Synth&FX',
    voices: [
      { name: 'ClubLead', type: 'Regular', msb: 104, lsb: 3, prg: 63 },
      { name: 'HPFDance', type: 'Regular', msb: 104, lsb: 0, prg: 91 },
      { name: 'DetunedSawOct', type: 'Regular', msb: 104, lsb: 8, prg: 82 },
      { name: 'DancyHook', type: 'Regular', msb: 104, lsb: 9, prg: 82 },
      { name: 'VinalogSaw', type: 'Regular', msb: 104, lsb: 3, prg: 82 },
      { name: 'TalkModLead', type: 'Regular', msb: 104, lsb: 0, prg: 88 },
      { name: 'SubLead', type: 'Regular', msb: 104, lsb: 0, prg: 81 },
      { name: 'SoftSaw', type: 'Regular', msb: 104, lsb: 16, prg: 82 },
      { name: 'FusionLead', type: 'Regular', msb: 104, lsb: 15, prg: 82 },
      { name: 'BleepLead', type: 'Regular', msb: 104, lsb: 0, prg: 85 },
      { name: 'Oxygen', type: 'Regular', msb: 0, lsb: 122, prg: 82 },
      { name: 'Matrix', type: 'Regular', msb: 0, lsb: 123, prg: 82 },
      { name: 'WireLead', type: 'Regular', msb: 0, lsb: 120, prg: 82 },
      { name: 'SoftR&B', type: 'Regular', msb: 0, lsb: 119, prg: 81 },
      { name: 'EarlyLead', type: 'Regular', msb: 0, lsb: 118, prg: 82 },
      { name: 'LektroCodes', type: 'Regular', msb: 104, lsb: 2, prg: 85 },
      { name: 'SimpleComp', type: 'Regular', msb: 104, lsb: 12, prg: 82 },
      { name: 'BalladComp', type: 'Regular', msb: 104, lsb: 6, prg: 89 },
      { name: 'HeavenBell', type: 'Regular', msb: 104, lsb: 0, prg: 101 },
      { name: 'BrightPadBell', type: 'Regular', msb: 104, lsb: 7, prg: 89 },
      { name: 'SoftSquare', type: 'Regular', msb: 104, lsb: 5, prg: 81 },
      { name: 'WildPWM', type: 'Regular', msb: 104, lsb: 4, prg: 81 },
      { name: 'DetunedVintage', type: 'Regular', msb: 104, lsb: 1, prg: 85 },
      { name: 'PWMLead', type: 'Regular', msb: 104, lsb: 1, prg: 82 },
      { name: 'BrassyLead', type: 'Regular', msb: 104, lsb: 5, prg: 63 },
      { name: 'PunchLead', type: 'Regular', msb: 104, lsb: 7, prg: 82 },
      { name: 'FlangeFilter', type: 'Regular', msb: 104, lsb: 2, prg: 82 },
      { name: 'MouthLead', type: 'Regular', msb: 104, lsb: 0, prg: 82 },
      { name: 'ResonantClavi', type: 'Regular', msb: 104, lsb: 2, prg: 91 },
      { name: 'ResonanceComp', type: 'Regular', msb: 104, lsb: 4, prg: 63 },
      { name: 'TrancePerc', type: 'Regular', msb: 104, lsb: 5, prg: 82 },
      { name: 'Chordmaster', type: 'Regular', msb: 104, lsb: 13, prg: 82 },
      { name: 'DigitalSeq', type: 'Regular', msb: 104, lsb: 2, prg: 88 },
      { name: 'AnalogSeq', type: 'Regular', msb: 104, lsb: 3, prg: 88 },
      { name: 'TranceSeq1', type: 'Regular', msb: 104, lsb: 4, prg: 88 },
      { name: 'TranceSeq2', type: 'Regular', msb: 104, lsb: 5, prg: 88 },
      { name: 'TranceSeq3', type: 'Regular', msb: 104, lsb: 1, prg: 91 },
      { name: 'PercSeqFS', type: 'Regular', msb: 104, lsb: 6, prg: 88 },
      { name: 'PercSeqFM1', type: 'Regular', msb: 104, lsb: 7, prg: 88 },
      { name: 'PercSeqFM2', type: 'Regular', msb: 104, lsb: 8, prg: 88 },
      { name: 'SynthSticks', type: 'Regular', msb: 104, lsb: 0, prg: 107 },
      { name: 'SazFeeze', type: 'Regular', msb: 104, lsb: 0, prg: 98 },
      { name: 'EasternAir', type: 'Regular', msb: 104, lsb: 1, prg: 98 },
      { name: 'Xtune', type: 'Regular', msb: 104, lsb: 1, prg: 88 },
      { name: 'PitchFall', type: 'Regular', msb: 104, lsb: 0, prg: 104 },
      { name: 'PercSeqSaw', type: 'Regular', msb: 104, lsb: 11, prg: 82 },
      { name: 'PercSeqHipa', type: 'Regular', msb: 104, lsb: 9, prg: 88 },
      { name: 'Attack', type: 'Regular', msb: 104, lsb: 4, prg: 82 },
      { name: 'PWMPercussion', type: 'Regular', msb: 104, lsb: 6, prg: 82 },
      { name: 'Nomad', type: 'Regular', msb: 104, lsb: 1, prg: 105 },
      { name: 'ChorusSawLead', type: 'Regular', msb: 104, lsb: 10, prg: 82 },
      { name: 'FaaatComp', type: 'Regular', msb: 104, lsb: 4, prg: 52 },
      { name: 'FatSawHook', type: 'Regular', msb: 104, lsb: 7, prg: 52 },
      { name: 'TechGlide', type: 'Regular', msb: 104, lsb: 14, prg: 82 },
      { name: 'DanceChords', type: 'Regular', msb: 104, lsb: 5, prg: 52 },
      { name: 'DanceHook', type: 'Regular', msb: 0, lsb: 112, prg: 87 },
      { name: 'OctaveHook', type: 'Regular', msb: 0, lsb: 113, prg: 87 },
      { name: 'HipaLead', type: 'Regular', msb: 0, lsb: 118, prg: 85 },
      { name: 'PunchyHook', type: 'Regular', msb: 0, lsb: 127, prg: 82 },
      { name: 'CryingLead', type: 'Regular', msb: 0, lsb: 114, prg: 88 },
      { name: 'HipLead', type: 'Regular', msb: 0, lsb: 113, prg: 81 },
      { name: 'HopLead', type: 'Regular', msb: 0, lsb: 117, prg: 81 },
      { name: 'TechLead', type: 'Regular', msb: 0, lsb: 117, prg: 85 },
      { name: 'Tekkline', type: 'Regular', msb: 0, lsb: 116, prg: 85 },
      { name: 'SoftMini', type: 'Regular', msb: 0, lsb: 124, prg: 81 },
      { name: 'TranceLead', type: 'Regular', msb: 0, lsb: 121, prg: 81 },
      { name: 'FireWire', type: 'Regular', msb: 0, lsb: 116, prg: 82 },
      { name: 'Analogon', type: 'Regular', msb: 0, lsb: 115, prg: 82 },
      { name: 'Skyline', type: 'Regular', msb: 0, lsb: 115, prg: 85 },
      { name: 'OrbitSine', type: 'Regular', msb: 0, lsb: 126, prg: 81 },
    ],
  },
  {
    category: 'Perc&Drum',
    voices: [
      { name: 'Vibraphone', type: 'Regular', msb: 0, lsb: 112, prg: 12 },
      { name: 'JazzVibes', type: 'Regular', msb: 0, lsb: 113, prg: 12 },
      { name: 'Suspense', type: 'Regular', msb: 0, lsb: 114, prg: 12 },
      { name: 'Marimba', type: 'Regular', msb: 0, lsb: 112, prg: 13 },
      { name: 'Xylophone', type: 'Regular', msb: 0, lsb: 112, prg: 14 },
      { name: 'SteelDrums', type: 'Regular', msb: 0, lsb: 112, prg: 115 },
      { name: 'Celesta', type: 'Regular', msb: 0, lsb: 112, prg: 9 },
      { name: 'Glockenspiel', type: 'Regular', msb: 0, lsb: 112, prg: 10 },
      { name: 'MusicBox', type: 'Regular', msb: 0, lsb: 112, prg: 11 },
      { name: 'TubularBells', type: 'Regular', msb: 0, lsb: 112, prg: 15 },
      { name: 'StackBell', type: 'Regular', msb: 104, lsb: 8, prg: 89 },
      { name: 'NiceBell', type: 'Regular', msb: 104, lsb: 9, prg: 89 },
      { name: 'Kalimba', type: 'Regular', msb: 0, lsb: 112, prg: 109 },
      { name: 'Dulcimer', type: 'Regular', msb: 0, lsb: 112, prg: 16 },
      { name: 'Timpani', type: 'Regular', msb: 0, lsb: 112, prg: 48 },
      { name: 'PowerKit1', type: 'Drums', msb: 127, lsb: 0, prg: 88 },
      { name: 'PowerKit2', type: 'Drums', msb: 127, lsb: 0, prg: 89 },
      { name: 'StandardKit1', type: 'Drums', msb: 127, lsb: 0, prg: 1 },
      { name: 'StandardKit2', type: 'Drums', msb: 127, lsb: 0, prg: 2 },
      { name: 'BrushKit', type: 'Drums', msb: 127, lsb: 0, prg: 41 },
      { name: 'AnalogT8Kit', type: 'Drums', msb: 127, lsb: 0, prg: 59 },
      { name: 'AnalogT9Kit', type: 'Drums', msb: 127, lsb: 0, prg: 60 },
      { name: 'BreakKit', type: 'Drums', msb: 127, lsb: 0, prg: 58 },
      { name: 'HipHopKit', type: 'Drums', msb: 127, lsb: 0, prg: 57 },
      { name: 'DanceKit', type: 'Drums', msb: 127, lsb: 0, prg: 28 },
      { name: 'StudioKit', type: 'Drums', msb: 127, lsb: 0, prg: 87 },
      { name: 'HitKit', type: 'Drums', msb: 127, lsb: 0, prg: 5 },
      { name: 'SymphonyKit', type: 'Drums', msb: 127, lsb: 0, prg: 49 },
      { name: 'RockKit', type: 'Drums', msb: 127, lsb: 0, prg: 17 },
      { name: 'JazzKit', type: 'Drums', msb: 127, lsb: 0, prg: 33 },
      { name: 'PopLatinKit', type: 'SFX Kit', msb: 126, lsb: 0, prg: 44 },
      { name: 'CubanKit', type: 'SFX Kit', msb: 126, lsb: 0, prg: 41 },
      { name: 'ArabicKit1', type: 'SFX Kit', msb: 126, lsb: 0, prg: 37 },
      { name: 'ArabicMixtureKit', type: 'SFX Kit', msb: 126, lsb: 0, prg: 65 },
      { name: 'IndianKit', type: 'SFX Kit', msb: 126, lsb: 0, prg: 115 },
      { name: 'ChineseKit', type: 'SFX Kit', msb: 126, lsb: 0, prg: 125 },
      { name: 'ChineseMixture Kit', type: 'SFX Kit', msb: 127, lsb: 0, prg: 128 },
      { name: 'RoomKit', type: 'Drums', msb: 127, lsb: 0, prg: 9 },
      { name: 'ElectroKit', type: 'Drums', msb: 127, lsb: 0, prg: 25 },
      { name: 'AnalogKit', type: 'Drums', msb: 127, lsb: 0, prg: 26 },
      { name: 'SFX Kit1', type: 'SFX Kit', msb: 126, lsb: 0, prg: 1 },
      { name: 'SFX Kit2', type: 'SFX Kit', msb: 126, lsb: 0, prg: 2 },
      { name: 'ArabicKit2', type: 'SFX Kit', msb: 126, lsb: 0, prg: 36 },
    ],
  },
  {
    category: 'OrganFlutes',
    voices: [
      { name: 'JazzDraw!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'BluesOrgan!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'SixteenOne!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'EvenBars!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'PopOrgan!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'RockingOrg!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'Percussive!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'GospelOrg!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'PadOrgan!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      { name: 'FullRanks!', type: 'OrganFlutes', msb: 0, lsb: 126, prg: 17 },
      // TODO: Legacy voices
    ],
  },
]

export default function PsrS910({ device }: { device: Output }) {
  const SYSEX_STYLE = 0x7e
  const SWITCH_ON = 0x7f
  const SWITCH_OFF = 0x00
  const INTRO_SWITCH: { [k: string]: number } = { A: 0x00, B: 0x01, C: 0x02, D: 0x03 }
  const MAIN_SWITCH: { [k: string]: number } = { A: 0x08, B: 0x09, C: 0x0a, D: 0x0b }
  const FILL_IN_SWITCH: { [k: string]: number } = { A: 0x10, B: 0x11, C: 0x12, D: 0x13 }
  const BREAK_SWITCH = 0x18
  const ENDING_SWITCH: { [k: string]: number } = { A: 0x20, B: 0x21, C: 0x22, D: 0x23 }
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <ButtonGroup>
          <Button minimal style={{ pointerEvents: 'none' }}>
            Intro
          </Button>
          {Object.keys(INTRO_SWITCH).map((v) => {
            return (
              <Button key={v} onClick={() => device.sendSysex(YAMAHA_ID, [SYSEX_STYLE, 0x00, INTRO_SWITCH[v], SWITCH_ON])}>
                {v}
              </Button>
            )
          })}
        </ButtonGroup>
        <Divider />

        <ButtonGroup>
          <Button minimal style={{ pointerEvents: 'none' }}>
            Main
          </Button>
          {Object.keys(MAIN_SWITCH).map((v) => {
            return (
              <Button key={v} onClick={() => device.sendSysex(YAMAHA_ID, [SYSEX_STYLE, 0x00, MAIN_SWITCH[v], SWITCH_ON])}>
                {v}
              </Button>
            )
          })}
        </ButtonGroup>
        <Divider />

        <ButtonGroup>
          <Button minimal style={{ pointerEvents: 'none' }}>
            Fill In
          </Button>
          {Object.keys(FILL_IN_SWITCH).map((v) => {
            return (
              <Button key={v} onClick={() => device.sendSysex(YAMAHA_ID, [SYSEX_STYLE, 0x00, FILL_IN_SWITCH[v], SWITCH_ON])}>
                {v}
              </Button>
            )
          })}
        </ButtonGroup>
        <Divider />

        <ButtonGroup>
          <Button onClick={() => device.sendSysex(YAMAHA_ID, [SYSEX_STYLE, 0x00, BREAK_SWITCH, SWITCH_ON])}>Break</Button>
        </ButtonGroup>
        <Divider />

        <ButtonGroup>
          <Button minimal style={{ pointerEvents: 'none' }}>
            Ending
          </Button>
          {Object.keys(ENDING_SWITCH).map((v) => {
            return (
              <Button key={v} onClick={() => device.sendSysex(YAMAHA_ID, [SYSEX_STYLE, 0x00, ENDING_SWITCH[v], SWITCH_ON])}>
                {v}
              </Button>
            )
          })}
        </ButtonGroup>
        <Divider />
      </div>
      <div>
        {VOICE_LIST.map((category) => (
          <div key={category.category}>
            <div>
              <Button minimal style={{ pointerEvents: 'none' }}>
                {category.category}
              </Button>
            </div>
            {category.voices.map((voice) => (
              <Button
                key={voice.name + voice.type}
                onClick={() => {
                  console.log(voice)
                  device.sendControlChange('bankselectcoarse', voice.msb)
                  device.sendControlChange('bankselectfine', voice.lsb)
                  device.sendProgramChange(voice.prg - 1)
                }}
              >
                {voice.name}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
