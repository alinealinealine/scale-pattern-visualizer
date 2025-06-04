import React, { useState, useRef, useCallback } from 'react'
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

// Define notes and their relationships
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_COLORS = {
  'C': '#e8f5e9', 'C#': '#fce4ec', 'D': '#e3f2fd', 'D#': '#f3e5f5',
  'E': '#fff3e0', 'F': '#e8f5e9', 'F#': '#fce4ec', 'G': '#e3f2fd',
  'G#': '#f3e5f5', 'A': '#fff3e0', 'A#': '#e8f5e9', 'B': '#fce4ec'
}

// Define notes and their frequencies
const NOTE_FREQUENCIES = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
  'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
  'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
}

// Piano key configuration
const PIANO_KEYS = [
  { note: 'C', isBlack: false }, { note: 'C#', isBlack: true },
  { note: 'D', isBlack: false }, { note: 'D#', isBlack: true },
  { note: 'E', isBlack: false },
  { note: 'F', isBlack: false }, { note: 'F#', isBlack: true },
  { note: 'G', isBlack: false }, { note: 'G#', isBlack: true },
  { note: 'A', isBlack: false }, { note: 'A#', isBlack: true },
  { note: 'B', isBlack: false }
]

// Helper function to get notes for a scale pattern starting from a given note
const getScaleNotes = (pattern, startNote) => {
  const notes = []
  let currentIndex = NOTES.indexOf(startNote)
  
  notes.push(NOTES[currentIndex])
  
  pattern.forEach(step => {
    if (step === 'W') {
      currentIndex = (currentIndex + 2) % 12
    } else if (step === 'H') {
      currentIndex = (currentIndex + 1) % 12
    } else if (step === 'W+H') {
      currentIndex = (currentIndex + 3) % 12
    }
    notes.push(NOTES[currentIndex])
  })
  
  return notes
}

// Scale patterns (W = Whole step, H = Half step)
const SCALE_PATTERNS = {
  'Major Scale': ['W', 'W', 'H', 'W', 'W', 'W', 'H'],
  'Natural Minor Scale': ['W', 'H', 'W', 'W', 'H', 'W', 'W'],
  'Harmonic Minor Scale': ['W', 'H', 'W', 'W', 'H', 'W+H', 'H'],
  'Melodic Minor Scale': ['W', 'H', 'W', 'W', 'W', 'W', 'H'],
  'Dorian Mode': ['W', 'H', 'W', 'W', 'W', 'H', 'W'],
  'Phrygian Mode': ['H', 'W', 'W', 'W', 'H', 'W', 'W'],
  'Lydian Mode': ['W', 'W', 'W', 'H', 'W', 'W', 'H'],
  'Mixolydian Mode': ['W', 'W', 'H', 'W', 'W', 'H', 'W'],
  'Locrian Mode': ['H', 'W', 'W', 'H', 'W', 'W', 'W'],
}

const PianoKey = ({ note, isBlack, isActive, isRoot, onClick }) => (
  <Tooltip title={note}>
    <Box
      onClick={onClick}
      sx={{
        width: isBlack ? 24 : 36,
        height: isBlack ? 80 : 120,
        bgcolor: isBlack ? '#333' : '#fff',
        border: '1px solid #ccc',
        borderRadius: isBlack ? '0 0 4px 4px' : '0 0 8px 8px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2,
        },
        ...(isActive && {
          bgcolor: isBlack ? '#666' : NOTE_COLORS[note],
          boxShadow: 2,
        }),
        ...(isRoot && {
          border: '2px solid #4caf50',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: '#4caf50',
          },
        }),
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          color: isBlack ? '#fff' : '#000',
          fontWeight: isActive ? 'bold' : 'normal',
        }}
      >
        {note}
      </Typography>
    </Box>
  </Tooltip>
)

const CircularPattern = ({ pattern, activeNotes, selectedRoot }) => {
  const radius = 100
  const center = { x: radius + 20, y: radius + 20 }
  const angleStep = (2 * Math.PI) / 12

  return (
    <Box sx={{ position: 'relative', width: radius * 2 + 40, height: radius * 2 + 40, mx: 'auto' }}>
      {/* Draw the circle */}
      <Box
        sx={{
          position: 'absolute',
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          border: '2px solid #e0e0e0',
          left: 20,
          top: 20,
        }}
      />
      
      {/* Draw the notes and connections */}
      {NOTES.map((note, index) => {
        const angle = index * angleStep - Math.PI / 2
        const x = center.x + radius * Math.cos(angle)
        const y = center.y + radius * Math.sin(angle)
        const isActive = activeNotes.includes(note)
        const isRoot = note === selectedRoot

        return (
          <React.Fragment key={note}>
            {/* Note point */}
            <Box
              sx={{
                position: 'absolute',
                left: x - 12,
                top: y - 12,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: isActive ? NOTE_COLORS[note] : '#fff',
                border: isRoot ? '2px solid #4caf50' : '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: 2,
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isRoot ? '#2e7d32' : 'inherit',
                }}
              >
                {note}
              </Typography>
            </Box>

            {/* Draw lines between active notes */}
            {isActive && activeNotes.indexOf(note) < activeNotes.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: center.x,
                  top: center.y,
                  width: radius,
                  height: 2,
                  bgcolor: '#1976d2',
                  transformOrigin: 'left center',
                  transform: `rotate(${angle}rad)`,
                  zIndex: 1,
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </Box>
  )
}

const AudioPlayer = ({ notes, isPlaying, onPlay, onPause, onComplete }) => {
  const audioContext = useRef(null)
  const oscillators = useRef([])
  const currentNoteIndex = useRef(0)
  const isAscending = useRef(true)
  const timeoutRef = useRef(null)

  const playNote = useCallback((note, duration = 500) => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const oscillator = audioContext.current.createOscillator()
    const gainNode = audioContext.current.createGain()
    
    oscillator.type = 'sine'
    oscillator.frequency.value = NOTE_FREQUENCIES[note]
    
    // Add some attack and release to make it sound more musical
    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + duration / 1000)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)
    
    oscillator.start()
    oscillator.stop(audioContext.current.currentTime + duration / 1000)
    
    oscillators.current.push(oscillator)
    return oscillator
  }, [])

  const playScale = useCallback((ascending = true) => {
    if (!isPlaying) return

    const sequence = ascending ? [...notes] : [...notes].reverse()
    isAscending.current = ascending
    currentNoteIndex.current = 0

    const playNextNote = () => {
      if (currentNoteIndex.current >= sequence.length || !isPlaying) {
        onComplete()
        return
      }

      const note = sequence[currentNoteIndex.current]
      playNote(note)
      currentNoteIndex.current++

      timeoutRef.current = setTimeout(playNextNote, 600) // Slightly longer than note duration
    }

    playNextNote()
  }, [notes, isPlaying, playNote, onComplete])

  const stopPlaying = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    oscillators.current.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // Oscillator might already be stopped
      }
    })
    oscillators.current = []
    currentNoteIndex.current = 0
  }, [])

  React.useEffect(() => {
    if (isPlaying) {
      playScale(isAscending.current)
    } else {
      stopPlaying()
    }

    return () => {
      stopPlaying()
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [isPlaying, playScale, stopPlaying])

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2 }}>
      <Tooltip title="Play ascending">
        <IconButton 
          onClick={() => {
            stopPlaying()
            isAscending.current = true
            onPlay()
          }}
          color="primary"
          disabled={isPlaying}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={isPlaying ? "Pause" : "Play"}>
        <IconButton 
          onClick={() => isPlaying ? onPause() : onPlay()}
          color="primary"
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Play descending">
        <IconButton 
          onClick={() => {
            stopPlaying()
            isAscending.current = false
            onPlay()
          }}
          color="primary"
          disabled={isPlaying}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const ScalePattern = ({ pattern, selectedRoot, onRootChange }) => {
  const [activeNotes, setActiveNotes] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  
  const handleNoteClick = (note) => {
    const newNotes = getScaleNotes(pattern, note)
    setActiveNotes(newNotes)
    onRootChange(note)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Steps Pattern */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 1 }}>
        {pattern.map((step, index) => (
          <Paper
            key={`step-${index}`}
            elevation={2}
            sx={{
              p: 1,
              minWidth: 40,
              textAlign: 'center',
              bgcolor: step === 'H' ? '#e3f2fd' : step === 'W+H' ? '#ffcdd2' : '#fff3e0',
              position: 'relative',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{step}</Typography>
            {index < pattern.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  right: -12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                }}
              >
                →
              </Box>
            )}
          </Paper>
        ))}
      </Box>

      {/* Circular Pattern */}
      <CircularPattern
        pattern={pattern}
        activeNotes={activeNotes}
        selectedRoot={selectedRoot}
      />
      
      {/* Piano Keyboard */}
      <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        {PIANO_KEYS.map((key, index) => (
          <Box
            key={key.note}
            sx={{
              position: 'relative',
              zIndex: key.isBlack ? 2 : 1,
              ml: index === 0 ? 0 : key.isBlack ? -12 : 0,
            }}
          >
            <PianoKey
              note={key.note}
              isBlack={key.isBlack}
              isActive={activeNotes.includes(key.note)}
              isRoot={key.note === selectedRoot}
              onClick={() => handleNoteClick(key.note)}
            />
          </Box>
        ))}
      </Box>

      {/* Audio Player */}
      {activeNotes.length > 0 && (
        <AudioPlayer
          notes={activeNotes}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onComplete={() => setIsPlaying(false)}
        />
      )}

      {/* Active Scale Notes */}
      {activeNotes.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 1 }}>
          {activeNotes.map((note, index) => (
            <Paper
              key={`active-note-${index}`}
              elevation={1}
              sx={{
                p: 1,
                minWidth: 40,
                textAlign: 'center',
                bgcolor: NOTE_COLORS[note],
                border: index === 0 ? '2px solid #4caf50' : '1px solid #e0e0e0',
                position: 'relative',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: index === 0 ? '#2e7d32' : 'inherit'
                }}
              >
                {note}
              </Typography>
              {index < activeNotes.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: -12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                  }}
                >
                  →
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}

const ScaleCard = ({ name, pattern }) => {
  const [selectedRoot, setSelectedRoot] = useState('C')
  const notes = getScaleNotes(pattern, selectedRoot)
  
  const getDescription = (scaleName) => {
    const baseDescription = {
      'Major Scale': 'The most common scale in Western music. Bright, happy sound.',
      'Natural Minor Scale': 'Sad, melancholic quality. Relative minor of the major scale.',
      'Harmonic Minor Scale': 'Similar to natural minor but with a raised 7th note for dramatic sound.',
      'Melodic Minor Scale': 'Used in classical music with different ascending/descending patterns.',
      'Dorian Mode': 'Minor scale with a major 6th. Popular in jazz and folk music.',
      'Phrygian Mode': 'Minor scale with a flat 2nd. Common in flamenco and metal music.',
      'Lydian Mode': 'Major scale with a raised 4th. Dreamy, ethereal quality.',
      'Mixolydian Mode': 'Major scale with a flat 7th. Common in blues and rock music.',
      'Locrian Mode': 'Diminished scale with a flat 2nd and 5th. Dark, unstable sound.',
    }[scaleName]

    return `${baseDescription} Current scale: ${notes.join(' - ')}`
  }

  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 4,
          }
        }}
      >
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <ScalePattern 
          pattern={pattern} 
          selectedRoot={selectedRoot}
          onRootChange={setSelectedRoot}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {getDescription(name)}
        </Typography>
      </Paper>
    </Grid>
  )
}

function App() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Scale Pattern Visualizer
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Explore scale patterns through multiple visualizations and sound
      </Typography>

      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Legend:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Paper sx={{ p: 1, bgcolor: '#fff3e0', minWidth: 40, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>W</Typography>
              </Paper>
              <Typography variant="body2">Whole Step (2 semitones)</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Paper sx={{ p: 1, bgcolor: '#e3f2fd', minWidth: 40, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>H</Typography>
              </Paper>
              <Typography variant="body2">Half Step (1 semitone)</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Paper sx={{ p: 1, bgcolor: '#ffcdd2', minWidth: 40, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>W+H</Typography>
              </Paper>
              <Typography variant="body2">Step and a Half (3 semitones)</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Paper sx={{ p: 1, bgcolor: '#e8f5e9', minWidth: 40, textAlign: 'center', border: '2px solid #4caf50' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>C</Typography>
              </Paper>
              <Typography variant="body2">Root Note</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(SCALE_PATTERNS).map(([name, pattern]) => (
          <ScaleCard key={name} name={name} pattern={pattern} />
        ))}
      </Grid>
    </Container>
  )
}

export default App 