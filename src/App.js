import React, { useState } from 'react';
import List from './List';
function App() {
  const [guestList, setGuestList] = useState([
    ['mariana', 'leiva', true, Math.random()],
    ['jose', 'ordoniez', false, Math.random()],
    ['marcela', 'yepes', false, Math.random()],
  ]);
  const [newGuestFirstName, setNewGuestFirstName] = useState('');
  const [newGuestLastName, setNewGuestLastName] = useState('');

  function addGuest(e) {
    e.preventDefault();
    const areGuestNamesEmpty =
      newGuestFirstName === '' || newGuestLastName === '' ? true : false;

    if (areGuestNamesEmpty) {
      return;
    }

    const stateBackup = guestList;
    setGuestList([
      [newGuestFirstName, newGuestLastName, false, Math.random() + new Date()],
      ...stateBackup,
    ]);
  }

  return (
    <>
      <h1>Guest List</h1>
      <form onSubmit={addGuest}>
        <button>Add</button>
        <input
          value={newGuestFirstName}
          onChange={(e) => setNewGuestFirstName(e.target.value)}
          type="text"
          placeholder="First Name"
        />
        <input
          value={newGuestLastName}
          onChange={(e) => setNewGuestLastName(e.target.value)}
          type="text"
          placeholder="Last Name"
        />
      </form>
      <List guestList={guestList} setGestList={setGuestList} />
    </>
  );
}

export default App;
