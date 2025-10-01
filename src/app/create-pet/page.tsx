// …imports + state + handleSubmit stay the same…

return (
  <main className="min-h-screen bg-slate-100 text-slate-900 p-6">
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg space-y-4">
      <h1 className="text-2xl font-semibold">Create Pet</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={species}
            onChange={(e) => setSpecies(e.target.value as 'dog' | 'cat' | 'horse')}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="horse">Horse</option>
          </select>

          <select
            className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sex}
            onChange={(e) => setSex(e.target.value as 'male' | 'female')}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <input
          className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Age (months)"
          type="number"
          min={0}
          value={ageMonths}
          onChange={(e) => setAgeMonths(e.target.value === '' ? '' : Number(e.target.value))}
        />

        <input
          className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border border-slate-300 bg-white p-3 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Short bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 focus:outline-none file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-800"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Create Pet'}
        </button>
      </form>

      {msg && <p className="text-sm text-slate-700">{msg}</p>}
    </div>
  </main>
);