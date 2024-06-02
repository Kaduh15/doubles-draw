import { ChangeEvent, useState } from 'react'
import { ModeToggle } from './components/mode-toggle'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { X } from 'lucide-react'

function drawDoubles(listPlayers: string[]) {
  if (listPlayers.length === 0) {
    throw new Error('Adicionar jogadores para sortear as duplas')
  }

  if (listPlayers.length % 2 !== 0) {
    throw new Error('Adicionar jogadores pares para sortear as duplas')
  }

  const players = [...listPlayers]
  const allDoubles: [string, string][] = []

  while (players.length) {
    const pair: [string, string] = ['', '']
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * players.length)
      pair[i] = players.splice(randomIndex, 1)[0]
    }
    allDoubles.push(pair)
  }

  return allDoubles
}

function PlayerList({
  players,
  removePlayer,
}: {
  players: string[]
  removePlayer: (index: number) => void
}) {
  return (
    <div className="max-h-96 overflow-y-auto">
      <ul className="flex flex-col gap-2 mt-2">
        {players.map((player, index) => (
          <li
            key={index}
            className="flex gap-2 justify-between items-center text-xl font-semibold bg-white dark:bg-gray-800 p-2 rounded shadow"
          >
            <span>{player}</span>
            <Button onClick={() => removePlayer(index)} className="p-1">
              <X className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DoublesResult({ doubles }: { doubles: [string, string][] }) {
  return (
    <>
      {doubles.map((pair, index) => (
        <div
          key={`${pair[0]} - ${pair[1]}`}
          className="w-full max-w-sm bg-white dark:bg-gray-800 p-4 rounded shadow-md flex flex-col items-center"
        >
          <p className="text-lg font-medium text-center mb-2">
            Dupla {index + 1}
          </p>
          <p className="text-base text-center">
            <span className="font-semibold">{pair[0]}</span> &{' '}
            <span className="font-semibold">{pair[1]}</span>
          </p>
        </div>
      ))}
    </>
  )
}

function App() {
  const [players, setPlayers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [doublesDrawn, setDoublesDrawn] = useState<[string, string][]>([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInputValue(target.value)
  }

  const addPlayer = () => {
    if (inputValue) {
      setPlayers((prev) =>
        Array.from(new Set([inputValue.toUpperCase(), ...prev])),
      )
      setInputValue('')
    }
  }

  const removePlayer = (index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index))
  }

  const drawDoublesHandler = () => {
    try {
      setDoublesDrawn(drawDoubles(players))
      setError(null)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
      <header className="w-full flex justify-end p-4">
        <ModeToggle />
      </header>
      <main className="w-full max-w-lg flex flex-col space-y-6">
        <section>
          <h1 className="text-3xl font-bold text-center">
            Adicionar Jogadores
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1"
              placeholder="Nome do jogador"
            />
            <Button onClick={addPlayer} className="w-full sm:w-auto">
              Adicionar
            </Button>
          </div>
        </section>
        <section className="mt-6">
          <h2 className="text-2xl font-semibold">Jogadores</h2>
          <PlayerList players={players} removePlayer={removePlayer} />
        </section>
        <section className="mt-6">
          <Button onClick={drawDoublesHandler} className="w-full">
            Sortear Duplas
          </Button>
        </section>
        <section className="flex flex-col items-center mt-4 space-y-2">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {!error && <DoublesResult doubles={doublesDrawn} />}
        </section>
      </main>
      <footer className="w-full flex justify-center p-4 mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 My App
        </p>
      </footer>
    </div>
  )
}

export default App
