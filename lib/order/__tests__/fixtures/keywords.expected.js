const Component1 = styled.div`
	color: tomato;
	a {
		color: blue;
	}

	@media screen {
		color: black;
	}
`;

const Component2 = styled.div`
	color: tomato;
	${Button} {
		color: blue;
	}
	@media screen {
		color: black;
	}
`;

const Component3 = styled.div`
	div {
		color: tomato;
		a {
			color: blue;
		}
	}
`;

const Component4 = styled.div`

	display: none;
	span {
	}

	div {
	}

	@media (min-width: 100px) {
	}
`;

const Component5 = styled.div`
	div {

		display: none;
		span {
		}

		div {
		}

		@media (min-width: 100px) {
		}
	}
`;
