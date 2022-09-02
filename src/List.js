import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from './globalStyle.js';

const Form = styled.form`
  width: 50vw;
  border: 1px solid transparent;
  border-radius: 5px;
  padding: 3px;
  div {
    display: inline;
    color: black;
  }
  background: ${(props) =>
    props.index % 2 === 0 ? `${colors.white}` : `${colors.grey}`};

  width: 80vw;
  grid-column: span 7;
  display: grid;
  gap: 15px;
  grid-template-columns: 40px 24vw 24vw 1fr 5vw 40px;
  align-items: center;
  ${(props) =>
    props.editOn
      ? 'grid-template-columns: 40px 24vw 24vw 1fr 5vw 5vw 40px;'
      : ''}

  ${(props) =>
    props.isAttendent
      ? `background: ${colors.green}; border: 1px solid #c8e0cc; div {visibility: hidden;}`
      : ''}
  ${(props) =>
    props.isAttendFilterOn && !props.isAttendent ? 'display: none;' : ''}
  ${(props) =>
    props.isNonAttendFilterOn && props.isAttendent ? 'display: none;' : ''}
`;

const Wrapper = styled.div`
  display: grid;
  width: 80vw;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
`;

const ButtonLarge = styled.button`
  margin-bottom: 10px;
`;

const TextInput = styled.input`
  background: ${colors.white}aa;
  border-radius: 5px;
  padding: 0 10px;
  border: none;
  border-bottom: 1px dotted #444;
  ${(props) =>
    props.readOnly
      ? 'pointer-events: none;'
      : `background-color: ${colors.white}aa; border: solid 1px #444;`}
  &:hover {
    background-color: ${colors.white};
    transform: scale(1.02);
  }
`;

const EditButton = styled.button`
  ${(props) => (props.onScreen ? 'display: none;' : '')}
`;

export const api_endpoint =
  'https://24c945df-dc40-4300-a4dc-8199f0214bf4.id.repl.co/guests/';

const List = (props) => {
  const [isAttendFilterOn, setIsAttendFilterOn] = useState(false);
  const [isNonAttendFilterOn, setIsNonAttendFilterOn] = useState(false);

  async function removeGuest(e, guest) {
    e.preventDefault();
    const response = await fetch(`${api_endpoint}${guest.id}`, {
      method: 'DELETE',
    });
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
    const response = await fetch(`${api_endpoint}${guest.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: guest.firstName,
        lastName: guest.lastName,
      }),
    });
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
    const response = await fetch(`${api_endpoint}${guest.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attendingState }),
    });
    await response.json();
    props.mirrorState();
  }

  async function removeAll() {
    const promiseArray = props.guestList.map((guest) =>
      fetch(`${api_endpoint}${guest.id}`, {
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
    <Wrapper>
      <ButtonLarge onClick={removeAll}>Remove all</ButtonLarge>
      <ButtonLarge
        onFocus={(e) => {
          if (props.indexOnEditMode !== '') {
            cancelEdit(e);
          }
        }}
        onClick={filterAttend}
      >
        Attending
      </ButtonLarge>
      <ButtonLarge
        onFocus={(e) => {
          if (props.indexOnEditMode !== '') {
            cancelEdit(e);
          }
        }}
        onClick={filterNonAttend}
      >
        Non Attending
      </ButtonLarge>
      <ButtonLarge onClick={removeFilters}>All</ButtonLarge>
      {props.guestList.map((guest, index) => (
        <Form
          index={index}
          editOn={props.indexOnEditMode === index}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                checkGuestCheckbox(guest);
                cancelEdit(e);
              }
            }}
          />
          <TextInput
            type="text"
            readOnly={props.indexOnEditMode !== index}
            onChange={(e) => editFirstNameValueOnIndex(e, index)}
            value={guest.firstName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                doneEditGuest(e, guest);
              }
              if (e.key === 'Escape') {
                cancelEdit(e);
              }
            }}
          />
          <TextInput
            type="text"
            readOnly={props.indexOnEditMode !== index}
            onChange={(e) => editLastNameValueOnIndex(e, index)}
            value={guest.lastName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                doneEditGuest(e, guest);
              }
              if (e.key === 'Escape') {
                cancelEdit(e);
              }
            }}
          />
          <div>
            {datePrinter(
              props.dateIdRef.filter((ref) => ref.id === guest.id)[0]?.date,
            )}
          </div>

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
        </Form>
      ))}
    </Wrapper>
  );
};

export default List;
