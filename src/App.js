import React, { useState, useEffect } from 'react';
import List from './List';
function App() {
  const [guestList, setGuestList] = useState([]);
  const [newGuestFirstName, setNewGuestFirstName] = useState('');
  const [newGuestLastName, setNewGuestLastName] = useState('');
  const [indexOnEditMode, setIndexOnEditMode] = useState('');
  const [actualDateInput, setActualDateInput] = useState(false);
  const [dateIdRef, setDateIdRef] = useState([]);

  function addGuest(e) {
    e.preventDefault();
    setIndexOnEditMode('');
    const areGuestNamesEmpty =
      newGuestFirstName === '' || newGuestLastName === '' ? true : false;

    if (areGuestNamesEmpty) {
      return;
    }
    async function postGuest() {
      const response = await fetch(`https://jh-guest-list.herokuapp.com/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newGuestFirstName,
          lastName: newGuestLastName,
        }),
      });
      const newGuest = await response.json();
      const newGuestIdItem = [
        { id: newGuest.id, date: actualDateInput },
        ...dateIdRef,
      ];
      localStorage.setItem('dateIdRef', JSON.stringify(newGuestIdItem));
      setDateIdRef(newGuestIdItem);

      mirrorState();
    }
    postGuest();
  }

  function mirrorState() {
    async function fetchData() {
      const response = await (
        await fetch('https://jh-guest-list.herokuapp.com/')
      ).json();
      setGuestList(response);
    }
    fetchData();
  }

  useEffect(() => {
    mirrorState();
  }, []);

  useEffect(() => {
    setDateIdRef(
      localStorage.getItem('dateIdRef')
        ? JSON.parse(localStorage.getItem('dateIdRef'))
        : [],
    );
  }, []);

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
        <input
          onChange={(e) => setActualDateInput(e.currentTarget.value)}
          type="datetime-local"
          name="deadLine"
          value={actualDateInput}
        />
      </form>
      <List
        guestList={guestList}
        mirrorState={mirrorState}
        setGuestList={setGuestList}
        indexOnEditMode={indexOnEditMode}
        setIndexOnEditMode={setIndexOnEditMode}
        setDateIdRef={setDateIdRef}
        dateIdRef={dateIdRef}
      />
    </>
  );
}

export default App;
