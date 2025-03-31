import { useState, useEffect } from 'react';
import './App.css';
import * as petService from "./services/petService";
import PetList from './components/PetList/PetList';
import PetDetail from './components/PetDetail/PetDetail';
import PetForm from './components/PetForm/PetForm';

const App = () => {
  const [pets, setPets] = useState([]);
  const [selected, setSelected] = useState(null);
  // state variable to control form visibility.
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Create a new useEffect
  useEffect(() => {
    // Create a new async function
    const fetchPets = async () => {

      try {
        // Call on the pet service's index function
        const fetchedPets = await petService.index();
        // Don't forget to pass the error object to the new Error
        if (fetchedPets.err) {
          throw new Error(fetchedPets.err);
        }

        // Set pets state to the returned pets data
        setPets(fetchedPets);
      } catch (err) {
        // Log the error object
        console.log(err);
      }
    };

    // Invoke the function
    fetchPets();
    // Add an empty dependency array to the `useEffect()` hook.
  }, []);


  const handleSelect = (pet) => {
    setSelected(pet);
  };

  // check whether the handleFormView() function has been passed a pet object. If not, we can presume the New Pet button has been pressed and set selected to null
  const handleFormView = (pet) => {
    if (!pet._id) setSelected(null);
    setIsFormOpen(!isFormOpen);
  };

  const handleAddPet = async (formData) => {
    try {
      // Call petService.create, assign return value to newPet
      const newPet = await petService.create(formData);

      // check if the response - newPet - has an error property. If so, throw a new Error
      if (newPet.err) {
        throw new Error(newPet.err);
      }

      // Add the pet object and the current pets to a new array, and
      // set that array as the new pets
      setPets([newPet, ...pets]);
      // Close the form after we've added the new pet
      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdatePet = async (formData, petId) => {
    try {
      const updatedPet = await petService.update(formData, petId);
      if (updatedPet.err) {
        throw new Error(updatedPet.err);
      }
      const updatedPetList = pets.map((pet) => (
        // If the _id of the current pet is not the same as the updated pet's _id,
        // return the existing pet.
        // If the _id's match, instead return the updated pet.
        pet._id !== updatedPet._id ? pet : updatedPet
      ));
      // Set pets state to this updated array
      setPets(updatedPetList);
      // If we don't set selected to the updated pet object, the details page will
      // reference outdated data until the page reloads.
      setSelected(updatedPet);
      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };


  const handleDeletePet = async (petId) => {
    try {
      const deletedPet = await petService.deletePet(petId);
      if (deletedPet.err) {
        throw new Error(deletedPet.err);
      }
      setPets(pets.filter((pet) => pet._id !== deletedPet._id));
      setSelected(null);
      setIsFormOpen(false);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <>
      <PetList
        pets={pets}
        handleSelect={handleSelect}
        handleFormView={handleFormView}
        isFormOpen={isFormOpen}
      />
      {/* Pass selected to PetForm and handleFormView to PetDetail */}
      {isFormOpen ? (
        <PetForm
          handleAddPet={handleAddPet}
          selected={selected}
          handleUpdatePet={handleUpdatePet}
        />
      ) : (
        <PetDetail
          selected={selected}
          handleFormView={handleFormView}
          handleDeletePet={handleDeletePet}
        />
      )}
    </>
  );
};

export default App;
