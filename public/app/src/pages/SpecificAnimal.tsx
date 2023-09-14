import { useParams } from "react-router-dom"
import { PageLayout } from "../elements/PageLayout"
import { useContext, useEffect, useState } from "react"
import { SpeciesContext } from "../utils/context/SpeciesContext"
import { Animal } from "../utils/domain/Animal"
import { IAnimalDTO } from "../utils/dtos/AnimalDTO"
import { AnimalImage } from "../elements/SpecificAnimal/AnimalImage"
import { CategoriesContext } from "../utils/context/CategoriesContext"
import { AnimalTraitsSlider } from "../elements/SpecificAnimal/AnimalTraitsSlider"
import { Specie } from "../utils/domain/Specie"
import { Species } from "../utils/domain/Species"
import { Categories } from "../utils/domain/Categories"
import { AnimalDescription } from "../elements/SpecificAnimal/AnimalDescription"
import { AnimalContactButton } from "../elements/SpecificAnimal/AnimalContactButton"
import { IUserContactDTO } from "../utils/dtos/UserDTO"
import { User } from "../utils/domain/User"
import { ISpecieDTO } from "../utils/dtos/SpecieDTO"

export const SpecificAnimal = () => {

  const {animalId} = useParams();
  const {species} = useContext(SpeciesContext);
  const {categories} = useContext(CategoriesContext);

  const [selectedAnimalDTO, setSelectedAnimalDTO] = useState<IAnimalDTO>()
  const [contactInfo, setContactInfo] = useState<IUserContactDTO>()
  const [selectedSpecie, setSelectedSpecie] = useState<ISpecieDTO>()
  const [isMale, setIsMale] = useState<boolean>()
  useEffect(() => {
    Animal.getSpecific(animalId as string).then((response) => {
      if (response.isLeft()) {
        alert("Não foi posível encontrar o animal.")
      } else {
        console.log(response.value)
        setSelectedAnimalDTO(response.value.props)
      }
    })

  }, [animalId])

  useEffect(() => {
    if (selectedAnimalDTO) {
      User.getUserContactInfo(selectedAnimalDTO.donator_id).then(response => {
        if (response.isLeft()) {
          alert("Não foi posível encontrar informacoes sobre o doador.")
        } else {
          setContactInfo(response.value)
        }
      })
    }
  }, [selectedAnimalDTO])

  //Clean code bizarro.
  useEffect(() => {
    if (selectedAnimalDTO) {
      const currentSpecie = Species.createFromDTO(species).findByID(selectedAnimalDTO.specie_id) as Specie
      if (currentSpecie) {
        setSelectedSpecie(currentSpecie.props)
      const sexoTrait = currentSpecie.getTraitByVariable("name", "Sexo")
      if (sexoTrait) {
        const selectedOptionValue = currentSpecie.getTraitOptionValueById(sexoTrait._id, Animal.create(selectedAnimalDTO).getTraitById(sexoTrait._id)?.value || '')
        if (selectedOptionValue) {
          if (selectedOptionValue.name === 'Fêmea') {
            setIsMale(false)
          } else {
            setIsMale(true)
          }
        }
      }
      }
    }
    }, [selectedAnimalDTO, species])

  
  return(
    <>
      {selectedAnimalDTO && selectedSpecie &&
      <div className="flex flex-col gap-3">
        <div className="px-8 pt-8">
          <AnimalImage AnimalImages={selectedAnimalDTO.image} AnimalName={selectedAnimalDTO.name}/>
        </div>
        <div className="px-8">
          <h1 className="text-2xl font-normal">{selectedAnimalDTO.name}</h1>
          <p className="text-xs">Por <button className="text-primary hover:underline">{contactInfo?.name}</button></p>
        </div>
        <AnimalTraitsSlider AnimalTraits={selectedAnimalDTO.traits} Specie={Species.createFromDTO(species).findByID(selectedAnimalDTO.specie_id) as Specie} Categories={Categories.createFromDTO(categories)}/>
        <AnimalDescription description={selectedAnimalDTO.description}/>
        <AnimalContactButton ContactDTO={contactInfo} isMale={isMale || false} AnimalName={selectedAnimalDTO.name}/>
      </div>}
    </>
  )
}