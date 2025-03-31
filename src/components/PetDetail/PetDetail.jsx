


const PetDetail = (props) => {
    // conditionally render a header that reads ‘NO DETAILS’ instead of pet details if no pet is currently selected.
    if (!props.selected) {
        return (
            <div className="details-container">
                <h1>NO DETAILS</h1>
            </div>
        );
    };

    // return statement if props.selected has a truthy value (a pet is selected)
    return (
        <div className="details-container">
            <h1>{props.selected.name}</h1>
            <h2>Breed: {props.selected.breed}</h2>
            <h2>
                Age: {props.selected.age} year{props.selected.age > 1 ? "s" : ""} old
            </h2>
            <div className="button-container">
            {/* pass the currently selected pet to the handleFormView() function */}
                <button onClick={() => props.handleFormView(props.selected)}>
                    Edit Pet
                </button>
                <button onClick={() => props.handleDeletePet(props.selected._id)}>
                    Delete pet
                </button>
            </div>
        </div>
    );
}


export default PetDetail;