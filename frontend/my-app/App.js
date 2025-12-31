import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';

export default function App() {

  const [taskList, setTaskList] = useState([]);      // all tasks
  const [textValue, setTextValue] = useState('');    // input box text
  const [editPos, setEditPos] = useState(null);      // which item is being edited


  const SERVER_URL = "http://localhost:3001";

  useEffect(() => {
    fetch(`${SERVER_URL}/load`)
      .then(res => res.json())
      .then(data => setTaskList(data))
      .catch(err => console.log("LOAD ERROR →", err));
  }, []);

  const handleAdd = () => {
    if (textValue.trim() === '') return;
    setTaskList([...taskList, textValue]);
    setTextValue('');
  };

  const handleUpdate = () => {
    if (textValue.trim() === '') return;

    const copy = [...taskList];
    copy[editPos] = textValue;

    setTaskList(copy);
    setTextValue('');
    setEditPos(null);
  };

  const handleDelete = (index) => {
    const copy = [...taskList];
    copy.splice(index, 1);
    setTaskList(copy);
  };

  const startEditing = (index) => {
    setTextValue(taskList[index]);     // put text back into input
    setEditPos(index);
  };

  const saveToServer = () => {
    // send tasks to backend
    fetch(`${SERVER_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskList),
    })
      .then(res => res.json())
      .then(msg => alert(msg.status))
      .catch(err => console.log("SAVE ERROR →", err));
  };

  const reloadFromServer = () => {
    // restore latest saved list
    fetch(`${SERVER_URL}/load`)
      .then(res => res.json())
      .then(data => setTaskList(data))
      .catch(err => console.log("RESTORE ERROR →", err));
  };

  const clearServerList = () => {
    // clear everything on backend too
    fetch(`${SERVER_URL}/clear`)
      .then(res => res.json())
      .then(msg => {
        setTaskList([]);
        alert(msg.status);
      })
      .catch(err => console.log("CLEAR ERROR →", err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <Button title="Save" onPress={saveToServer} />
        <Button title="Restore" onPress={reloadFromServer} />
        <Button title="Clear" onPress={clearServerList} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={textValue}
          onChangeText={setTextValue}
          placeholder="Enter task"
        />
        <Button
          title={editPos !== null ? "Update" : "Add"}
          onPress={editPos !== null ? handleUpdate : handleAdd}
        />
      </View>

      <FlatList
        data={taskList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.todoItem}>
            <Text>{item}</Text>

            <View style={styles.icons}>
              <TouchableOpacity onPress={() => startEditing(index)} style={styles.button}>
                <Text>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(index)} style={styles.button}>
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  topButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, flex: 1, marginRight: 10 },
  todoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, paddingBottom: 5 },
  icons: { flexDirection: 'row' },
  button: { marginLeft: 10 }
});
