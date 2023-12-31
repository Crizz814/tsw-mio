import {
  Button,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {useBuscarInfoQuery} from "../../queries/queryEjemplo"
import { Link } from "react-router-dom";
export default function Pokemon() {
  const [pokemones, setPokemones] = useState([]);
  const [listaAux, setListaAux] = useState([]);
  const [listaSeleccionados, setListaSeleccionados] = useState([]);
  const [buscador, setBuscador] = useState("");

  const [params, setParams]= useState({limit: 151 , page: 1})


  const {data: pokemon, isLoading: cargandoPokes, isSuccess, isError }  = useBuscarInfoQuery(params); 



  useEffect(()=>{
    isSuccess&&setPokemones(pokemon)  
  },[isSuccess]);

  useEffect(()=>{
    isError&&console.log("error");
  },[isError])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBuscador(value);
  };


  const handleInputChangeLimit = (event) => {
    const { name, value } = event.target;
    setParams({ limit : value});
  };



  function selectPokemon(valor) {
    if (!listaSeleccionados.includes(valor)) {
      setListaSeleccionados((listaSeleccionados) => [...listaSeleccionados,valor]);
      let otros;
      otros = pokemones.filter((item) => item !== valor);
      setPokemones(otros);

      let otros2;
      otros2 = listaAux.filter((item)=> item !== valor);
      setListaAux(otros2);
      console.log(otros2);
    }
  }

  function returnPokemon(valor){
    setPokemones(pokemones=> [valor, ... pokemones]);
    let filtro1;
    filtro1 = listaSeleccionados.filter(item => item !== valor);
    setListaSeleccionados(filtro1);
    if(valor.name.startsWith(buscador) && buscador){
      setListaAux(listaAux => [...listaAux, valor]);
    }
  }
  useEffect(() => {
    if (buscador.trim() !== "") {
      let result = pokemones.filter((item) =>
        //item.name.toString().includes(buscador.toString().trim())
        item.name.startsWith(buscador)
      );
      setListaAux(result);
    } else {
      setListaAux([]);
    }
  }, [buscador]);

  return (
    <>
      <input name="buscador" onChange={handleInputChange}></input>
      <input name="limitMax" onChange={handleInputChangeLimit}></input>

      <Grid container spacing={1}>
        <Grid item md={4} xs={6}>
        {cargandoPokes &&<LinearProgress/>}
          <List>
            {pokemon?.map((item, index) => (
              <>
                <ListItem disablePadding key={index}>
                  <Link to={`/PokeDetalle/${item.id}`}>{item.name}</Link>
                </ListItem>
                <Divider></Divider>
              </>
            ))}
          </List>
        </Grid>

        <Grid item md={4} xs={6}>
          <List>
            {listaAux.map((item, index) => (
              <>
                <ListItem disablePadding key={index}>
                  <ListItemText primary={item.name} />
                  <Button
                    variant="outlined"
                    onClick={() => selectPokemon(item)}
                  >
                    Miiiiirame!
                  </Button>
                </ListItem>
                <Divider></Divider>
              </>
            ))}
          </List>
        </Grid>

        <Grid item md={4} xs={6}>
          <List>
            {listaSeleccionados.map((item, index) => (
              <>
                <ListItem disablePadding key={index}>
                  <ListItemText primary={item.name} />
                  <Button
                    variant="outlined"
                    onClick={() => returnPokemon(item)}
                  >
                    de vuelta
                  </Button>
                </ListItem>
                <Divider></Divider>
              </>
            ))}
          </List>
        </Grid>
      </Grid>
    </>
  );
}
