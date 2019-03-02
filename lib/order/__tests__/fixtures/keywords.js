const Component1 = styled.div`
	a {
		color: blue;
	}
	color: tomato;

	@media screen {
		color: black;
	}
`;

const Component2 = styled.div`
	@media screen {
		color: black;
	}
	${Button} {
		color: blue;
	}
	color: tomato;
`;

const Component3 = styled.div`
	div {
		a {
			color: blue;
		}
		color: tomato;
	}
`;

const Component4 = styled.div`
	span {
	}

	display: none;

	@media (min-width: 100px) {
	}

	div {
	}
`;

const Component5 = styled.div`
	div {
		span {
		}

		display: none;

		@media (min-width: 100px) {
		}

		div {
		}
	}
`;
