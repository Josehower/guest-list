import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  width: 50vw;
  div {
    display: inline;
    color: black;
  }
  ${(props) =>
    props.isAttendent
      ? 'background: #90ee90; div {display: none;}'
      : 'background: #FFA6A6;'}
  ${(props) =>
    props.isAttendFilterOn && !props.isAttendent ? 'display: none;' : ''}
  ${(props) =>
    props.isNonAttendFilterOn && props.isAttendent ? 'display: none;' : ''}
`;

const EditButton = styled.button`
  ${(props) => (props.onScreen ? 'display: none;' : '')}
`;

const List = (props) => {
  const [isAttendFilterOn, setIsAttendFilterOn] = useState(false);
  const [isNonAttendFilterOn, setIsNonAttendFilterOn] = useState(false);

  async function removeGuest(e, guest) {
    e.preventDefault();
    const response = await fetch(
      `https://jh-guest-list.herokuapp.com/${guest.id}`,
      { method: 'DELETE' },
    );
    await response.json();
    const dateIdRefStorage = JSON.parse(localStorage.getItem('dateIdRef'));
    const newRef = dateIdRefStorage.filter(({ id }) => id !== guest.id);
    props.setDateIdRef(newRef);
    localStorage.setItem('dateIdRef', JSON.stringify(newRef));
    props.mirrorState();
  }

  function editGuest(e, index) {
    e.preventDefault();
    props.mirrorState();
    props.setIndexOnEditMode(index);
  }

  async function doneEditGuest(e, guest) {
    e.preventDefault();
    props.setIndexOnEditMode('');
    const response = await fetch(
      `https://jh-guest-list.herokuapp.com/${guest.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: guest.firstName,
          lastName: guest.lastName,
        }),
      },
    );
    await response.json();
    props.mirrorState();
  }
  function cancelEdit(e) {
    e.preventDefault();
    props.setIndexOnEditMode('');
    props.mirrorState();
  }

  function editFirstNameValueOnIndex(e, index) {
    e.preventDefault();
    const guestListBackup = [...props.guestList];
    guestListBackup[index].firstName = e.currentTarget.value;
    props.setGuestList(guestListBackup);
  }
  function editLastNameValueOnIndex(e, index) {
    e.preventDefault();
    const guestListBackup = [...props.guestList];
    guestListBackup[index].lastName = e.currentTarget.value;
    props.setGuestList(guestListBackup);
  }

  async function checkGuestCheckbox(guest) {
    const attendingState = !guest.attending;
    const response = await fetch(
      `https://jh-guest-list.herokuapp.com/${guest.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending: attendingState }),
      },
    );
    await response.json();
    props.mirrorState();
  }

  async function removeAll() {
    const promiseArray = props.guestList.map((guest) =>
      fetch(`https://jh-guest-list.herokuapp.com/${guest.id}`, {
        method: 'DELETE',
      }),
    );
    await Promise.all(promiseArray);
    localStorage.removeItem('dateIdRef');
    props.setDateIdRef([]);
    props.mirrorState();
  }

  function filterAttend() {
    setIsAttendFilterOn(true);
    setIsNonAttendFilterOn(false);
  }

  function filterNonAttend() {
    setIsNonAttendFilterOn(true);
    setIsAttendFilterOn(false);
  }
  function removeFilters() {
    setIsNonAttendFilterOn(false);
    setIsAttendFilterOn(false);
  }

  function datePrinter(dateRef) {
    if (dateRef) {
      const dateFromRef = new Date(dateRef);
      const actualDate = Date.now();

      return +dateFromRef - actualDate > 0
        ? `RSVP deadline is ${dateFromRef.getDate()}/${
            dateFromRef.getMonth() + 1
          }/${dateFromRef.getFullYear()}`
        : `Deadline overdue`;
    }
    return ``;
  }
  return (
    <>
      <button onClick={removeAll}>Remove all</button>
      <button
        onFocus={(e) => {
          if (props.indexOnEditMode !== '') {
            cancelEdit(e);
          }
        }}
        onClick={filterAttend}
      >
        Attending
      </button>
      <button
        onFocus={(e) => {
          if (props.indexOnEditMode !== '') {
            cancelEdit(e);
          }
        }}
        onClick={filterNonAttend}
      >
        Non Attending
      </button>
      <button onClick={removeFilters}>All</button>
      {props.guestList.map((guest, index) => (
        <Form
          isAttendent={guest.attending}
          isAttendFilterOn={isAttendFilterOn}
          isNonAttendFilterOn={isNonAttendFilterOn}
          key={guest.id}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="checkbox"
            checked={guest.attending}
            onChange={() => checkGuestCheckbox(guest)}
            onFocus={(e) => {
              if (props.indexOnEditMode !== '') {
                cancelEdit(e);
              }
            }}
          />
          <input
            type="text"
            readOnly={props.indexOnEditMode !== index}
            onChange={(e) => editFirstNameValueOnIndex(e, index)}
            value={guest.firstName}
          />
          <input
            type="text"
            readOnly={props.indexOnEditMode !== index}
            onChange={(e) => editLastNameValueOnIndex(e, index)}
            value={guest.lastName}
          />

          <EditButton
            onScreen={props.indexOnEditMode === index ? true : false}
            onClick={(e) => editGuest(e, index)}
          >
            edit
          </EditButton>
          <EditButton
            onScreen={props.indexOnEditMode !== index ? true : false}
            type="submit"
            onClick={(e) => doneEditGuest(e, guest)}
          >
            save
          </EditButton>
          <EditButton
            onScreen={props.indexOnEditMode !== index ? true : false}
            type="submit"
            onClick={(e) => cancelEdit(e)}
          >
            cancel
          </EditButton>
          <button onClick={(e) => removeGuest(e, guest)}>X</button>
          <div>
            {datePrinter(
              props.dateIdRef.filter((ref) => ref.id === guest.id)[0]?.date,
            )}
          </div>
        </Form>
      ))}
    </>
  );
};

export default List;
