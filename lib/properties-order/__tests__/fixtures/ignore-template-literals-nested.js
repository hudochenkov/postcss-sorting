const Component = styled.div`
	z-index: 1;
	top: 1px;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;

	div {
		z-index: 2;
		position: static;
		top: 2px;
		display: inline-block;

		span {
			z-index: 3;
			top: 3px;
			display: flex;
			position: relative;
		}
	}
`;

const Component2 = styled.div`
	z-index: 1;
	top: 1px;
	position: absolute;
	display: block;

	div {
		z-index: 2;
		${props => props.great && 'color: red'};
		position: static;
		top: 2px;
		display: inline-block;

		span {
			z-index: 3;
			top: 3px;
			display: flex;
			position: relative;
		}
	}
`;

const Component3 = styled.div`
	z-index: 1;
	top: 1px;
	position: absolute;
	display: block;

	div {
		z-index: 2;
		position: static;
		top: 2px;
		display: inline-block;

		span {
			z-index: 3;
			top: 3px;
			display: flex;
			${props => props.great && 'color: red'};
			position: relative;
		}
	}
`;
