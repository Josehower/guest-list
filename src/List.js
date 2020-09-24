import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  ${(props) => (props.isAssistent ? 'background: green;' : 'background: red;')}
  ${(props) =>
    props.isAssistFilterOn && !props.isAssistent ? 'display: none;' : ''}
  ${(
    props,
  ) => (props.isNonAssistFilterOn && props.isAssistent ? 'display: none;' : '')}
`;

const EditButton = styled.button`
  ${(props) => (props.onScreen ? 'display: none;' : '')}
`;

const List = (props) => {
  const [isAssistFilterOn, setIsAssistFilterOn] = useState(false);
  const [isNonAssistFilterOn, setIsNonAssistFilterOn] = useState(false);
  const [indexOnEditMode, setIndexOnEditMode] = useState('');

  function removeGuest(e, index) {
    e.preventDefault();
    let stateBackup = props.guestList;
    stateBackup = stateBackup.filter(
      (guest, guestIndex) => guestIndex !== index,
    );
    props.setGestList([...stateBackup]);
  }

  function editGuest(e, index) {
    setIndexOnEditMode(index);
  }

  function doneEditGuest(e) {
    e.preventDefault();
    setIndexOnEditMode('');
  }

  function editFirstNameValueOnIndex(e, index) {
    e.preventDefault();
    let stateBackup = props.guestList;
    stateBackup[index] = [
      e.currentTarget.value,
      stateBackup[index][1],
      stateBackup[index][2],
      stateBackup[index][3],
    ];
    props.setGestList([...stateBackup]);
  }
  function editLastNameValueOnIndex(e, index) {
    e.preventDefault();
    let stateBackup = props.guestList;
    stateBackup[index] = [
      stateBackup[index][0],
      e.currentTarget.value,
      stateBackup[index][2],
      stateBackup[index][3],
    ];
    props.setGestList([...stateBackup]);
  }

  function checkGuestCheckbox(index) {
    const stateBackup = props.guestList;
    stateBackup[index][2] = stateBackup[index][2] ? false : true;
    props.setGestList([...stateBackup]);
  }

  function removeAll() {
    props.setGestList([]);
  }

  function filterAssist() {
    setIsAssistFilterOn(true);
    setIsNonAssistFilterOn(false);
  }

  function filterNonAssist() {
    setIsNonAssistFilterOn(true);
    setIsAssistFilterOn(false);
  }
  function removeFilters() {
    setIsNonAssistFilterOn(false);
    setIsAssistFilterOn(false);
  }
  return (
    <>
      <button onClick={removeAll}>Remove all</button>
      <button onClick={filterAssist}>Assistant</button>
      <button onClick={filterNonAssist}>Non Assistant</button>
      <button onClick={removeFilters}>All</button>
      {props.guestList.map((assistant, index) => (
        <Form
          isAssistent={assistant[2]}
          isAssistFilterOn={isAssistFilterOn}
          isNonAssistFilterOn={isNonAssistFilterOn}
          key={assistant[3]}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="checkbox"
            checked={assistant[2]}
            onChange={(e) => checkGuestCheckbox(index)}
          />
          <input
            type="text"
            readOnly={indexOnEditMode !== index}
            onChange={(e) => editFirstNameValueOnIndex(e, index)}
            value={assistant[0]}
          />
          <input
            type="text"
            readOnly={indexOnEditMode !== index}
            onChange={(e) => editLastNameValueOnIndex(e, index)}
            value={assistant[1]}
          />
          <EditButton
            onScreen={indexOnEditMode === index ? true : false}
            onClick={(e) => editGuest(e, index)}
          >
            edit
          </EditButton>
          <EditButton
            onScreen={indexOnEditMode !== index ? true : false}
            type="submit"
            onClick={(e) => doneEditGuest(e, index)}
          >
            done
          </EditButton>
          <button onClick={(e) => removeGuest(e, index)}>X</button>
        </Form>
      ))}
    </>
  );
};

export default List;
