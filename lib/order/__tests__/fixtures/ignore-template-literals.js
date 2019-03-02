const Component1 = styled.div`
	a {
		color: blue;
	}
	color: tomato;
	${props => props.great && 'color: red'};

	@media screen {
		color: black;
	}
`;

const Component3 = styled.div`
	${props => props.great && 'color: red'};
	div {
		a {
			color: blue;
		}
		color: tomato;
	}
`;

const Component5 = styled.div`
	div {
		${props => props.great && 'color: red'};
		span {
		}

		display: none;

		@media (min-width: 100px) {
		}

		div {
		}
	}
`;
