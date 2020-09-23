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

const List = (props) => {
  const [isAssistFilterOn, setIsAssistFilterOn] = useState(false);
  const [isNonAssistFilterOn, setIsNonAssistFilterOn] = useState(false);

  function removeGuest(e, index) {
    e.preventDefault();
    let stateBackup = props.guestList;
    stateBackup = stateBackup.filter(
      (guest, guestIndex) => guestIndex !== index,
    );
    props.setGestList([...stateBackup]);
  }

  function editGuest() {
    console.log('allow Edit');
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
    console.log('assistant filtered');
    setIsAssistFilterOn(true);
    setIsNonAssistFilterOn(false);
  }

  function filterNonAssist() {
    console.log('nonAssistant filtered');
    setIsNonAssistFilterOn(true);
    setIsAssistFilterOn(false);
  }
  function removeFilters() {
    console.log('see All again');
    setIsNonAssistFilterOn(false);
    setIsAssistFilterOn(false);
  }
  //   .filter((assistant) => assistant[2])
  //   .filter((assistant) => !assistant[2])
  return (
    <>
      {props.guestList.map((assistant, index) => (
        <Form
          isAssistent={assistant[2]}
          isAssistFilterOn={isAssistFilterOn}
          isNonAssistFilterOn={isNonAssistFilterOn}
          key={assistant[1] + index}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="checkbox"
            checked={assistant[2]}
            onChange={(e) => checkGuestCheckbox(index)}
          />
          <input type="text" readOnly value={assistant[0]} />
          <input type="text" readOnly value={assistant[1]} />
          <button onClick={(e) => editGuest(e, index)}>edit</button>
          <button onClick={(e) => removeGuest(e, index)}>X</button>
        </Form>
      ))}
      <button onClick={removeAll}>Remove all</button>
      <button onClick={filterAssist}>Assistant</button>
      <button onClick={filterNonAssist}>Non Assistant</button>
      <button onClick={removeFilters}>All</button>
    </>
  );
};

export default List;
