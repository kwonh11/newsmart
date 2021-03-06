import styled from "styled-components";
import PlaceContainer from "../container/PlaceContainer";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function PlacePage() {
  console.log("PlacePage");

  return (
    <Container>
      <PlaceContainer />
    </Container>
  );
}
