import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Menu = () => {
  const navigation = useNavigation();
  const [polls, setPolls] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollChoices, setNewPollChoices] = useState('');
  const [image, setImage] = useState(null);
  const [selectedPollIndex, setSelectedPollIndex] = useState(null);
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://172.20.10.3:8000/poll_list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

  if (response.ok) {
    const result=[]
    // console.log(data.message.output)
    for (const poll of data.message.output){
      // console.log(poll)
      result.push({
        title: poll[1],
        image: poll[5],
        choices: poll[2].map((value,index)=> {
          return {label: value, votes:0};
        }
        ),
        isClosed: poll[3]
      })
    }
    // console.log(result)
    setPolls(result);
  } else {
    Alert.alert('Error', data.error || 'Failed to fetch polls');
  }
  }
  catch (error) {
    console.error('Error fetching polls:', error);
  };
}
  const startPolling = async () => {
    // Set up polling to fetch polls every 5 seconds (adjust the interval as needed)
  const pollInterval = setInterval(() => {
    console.log("polling (every 5 sec)")
    fetchPolls();
  }, 5000); // 5000 milliseconds (5 seconds)
  
  // Clear the interval when the component is unmounted
  return () => clearInterval(pollInterval);

} 
  useEffect(() => {
    // Fetch the list of polls when the component mounts
    fetchPolls();
    return startPolling();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const addPoll = async () => {
    if (newPollTitle.trim() === '' || newPollChoices.trim() === '') {
      alert('Please enter a title and at least one choice.');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.3:8000/create_poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newPollTitle,
          options: newPollChoices.split(',').map((choice) => choice.trim()),
          image_Url: image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewPollTitle('');
        setNewPollChoices('');
        setImage('');
        toggleModal();
        console.log("Add Poll")
      } else {
        Alert.alert('Error', data.error || 'Failed to create poll');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const goToDetailPage = (pollIndex) => {
    navigation.navigate('Detail', { poll: polls[pollIndex] });
  };

  const toggleConfirmationModal = (pollIndex) => {
    console.log(pollIndex)
    setSelectedPollIndex(pollIndex);
    setConfirmationModalVisible(!isConfirmationModalVisible);
  };

  const confirmClosePoll = async (id) => {
    try {
      console.log(id)
      const response = await fetch('http://172.20.10.3:8000/close_poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId:id,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        fetchPolls(); // Refresh the polls after closing the poll
        console.log("Close Poll")

      } else {
        Alert.alert('Error', data.error || 'Failed to close poll');
      }
    } catch (error) {
      console.error('Error closing poll:', error);
    }

    setConfirmationModalVisible(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        // Access the first selected asset's URI
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  
  

   return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.newPollContainer}>
        <TouchableOpacity style={styles.newPollButton} onPress={toggleModal}>
          <Text style={styles.newPollText}>Create New Poll</Text>
        </TouchableOpacity>
      </View>


      <ScrollView style={styles.pollsContainer} contentContainerStyle={styles.scrollContentContainer}>
        {polls && polls.length > 0 ? (
          polls.map((poll, index) => (
            <TouchableOpacity key={index} onPress={() => goToDetailPage(index)}>
              <View style={styles.pollContainer}>
                {poll.isClosed && (
                  <View style={[styles.overlay, { zIndex: 1 }]}>
                    <Image source={require('./closed.png')} style={[styles.closedImage, { width: 300, height: 200 }]} />
                  </View>
                )}
                <View style={styles.pollBorder}>
                  <View style={styles.pollTitleContainer}>
                    <Text style={styles.pollTitle}>{poll.title}</Text>
                    {!poll.isClosed && (
                      <TouchableOpacity onPress={() => toggleConfirmationModal(index)}>
                        <Text style={styles.closeButton}>X</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {poll.image && <Image source={{ uri: poll.image }} style={styles.pollImage} />}
                  <View style={styles.choicesContainer}>
                    {poll.choices.map((choice, choiceIndex) => (
                      <TouchableOpacity
                        key={choiceIndex}
                        style={styles.choiceButton}
                        onPress={() => (!poll.isClosed ? vote(index, choiceIndex) : null)}
                        disabled={poll.isClosed}
                      >
                        <Text style={styles.choiceText}>
                          {choice.label} - {choice.votes} votes
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No polls available</Text>
        )}
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an image from gallery</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.modalImage} />}
          <TextInput
            style={styles.input}
            placeholder="Poll Title"
            placeholderTextColor='grey'
            value={newPollTitle}
            onChangeText={(text) => setNewPollTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter choices (comma to separate)"
            placeholderTextColor='grey'
            value={newPollChoices}
            onChangeText={(text) => setNewPollChoices(text)}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButtonA} onPress={addPoll}>
              <Text style={styles.buttonText}>Add Poll</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal animationType="slide" transparent={true} visible={isConfirmationModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.confirmationText}>Are you sure you want to close the poll?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButtonA} onPress={() => confirmClosePoll(polls[selectedPollIndex].id)}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setConfirmationModalVisible(false)}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
      
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  newPollContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  newPollButton: {
    backgroundColor: '#ba454d',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    borderColor: 'grey',
    borderWidth: 1,
    alignItems: 'center',
  },
  newPollText: {
    fontSize: 16,
    color: 'white',
  },
  pollsContainer: {
    marginTop: 20,
    width: '80%',
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  pollContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  pollBorder: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: '#b5464c',
    backgroundColor: 'white',
  },
  pollTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pollTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  closedImage: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
  closeButton: {
    fontSize: 25,
    color: '#b5464c',
    marginBottom: 15,
    marginTop: 15,
  },
  pollImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  choicesContainer: {
    alignItems: 'flex-start',
  },
  choiceButton: {
    backgroundColor: '#293764',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ede8e8',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    backgroundColor: '#ba454d',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '48%',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
  },
  modalButtonA: {
    backgroundColor: '#f28159',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '48%',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
  },
  imagePickerButton: {
    backgroundColor: '#2b3966',
    padding: 10,
    borderRadius: 10,
    marginTop: -250,
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
});

export default Menu;