const Component = styled.div`
	z-index: 1;
	top: 1px;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;

	div {
		position: static;
		top: 2px;
		display: inline-block;
		z-index: 2;

		span {
			position: relative;
			top: 3px;
			display: flex;
			z-index: 3;
		}
	}
`;

const Component2 = styled.div`
	position: absolute;
	top: 1px;
	display: block;
	z-index: 1;

	div {
		z-index: 2;
		${props => props.great && 'color: red'};
		position: static;
		top: 2px;
		display: inline-block;

		span {
			position: relative;
			top: 3px;
			display: flex;
			z-index: 3;
		}
	}
`;

const Component3 = styled.div`
	position: absolute;
	top: 1px;
	display: block;
	z-index: 1;

	div {
		position: static;
		top: 2px;
		display: inline-block;
		z-index: 2;

		span {
			z-index: 3;
			top: 3px;
			display: flex;
			${props => props.great && 'color: red'};
			position: relative;
		}
	}
`;
