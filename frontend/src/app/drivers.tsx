export const drivers = [
  {
    id: 1,
    nome: "Homer Simpson",
    descricao:
      "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
    carro: {
      modelo: "Plymouth Valiant 1973",
      cor: "rosa e enferrujado",
    },
    avaliacao: 2,
    comentario:
      "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
    taxa: 2.5,
    km_minimo: 1,
  },
  {
    id: 2,
    nome: "Dominic Toretto",
    descricao:
      "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
    carro: {
      modelo: "Dodge Charger R/T 1970",
      cor: "modificado",
    },
    avaliacao: 4,
    comentario:
      "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!",
    taxa: 5.0,
    km_minimo: 5,
  },
  {
    id: 3,
    nome: "James Bond",
    descricao:
      "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
    carro: {
      modelo: "Aston Martin DB5",
      cor: "clássico",
    },
    avaliacao: 5,
    comentario:
      "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.",
    taxa: 10.0,
    km_minimo: 10,
  },
];

export function getDriver(selected_km: number) {
  const filteredDrivers = drivers.filter(
    (driver) => driver.km_minimo <= selected_km
  );

  if (filteredDrivers.length > 0) {
    const drivers = filteredDrivers.map((driver) => {
      return {
        id: driver.id,
        name: driver.nome,
        description: driver.descricao,
        vehicle: driver.carro,
        review: {
          rating: driver.avaliacao,
          comment: driver.comentario,
        },
        value: driver.taxa,
      };
    });
    return drivers;
  } else {
    return "Nenhum motorista disponível para essa distância.";
  }
}
