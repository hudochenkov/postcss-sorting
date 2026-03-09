// Only first group is unordered
const Component = styled.div`
	z-index: 2;
	top: 0;
	${props => props.great && 'color: red'};
	position: absolute;
	display: block;
`;

// Only second group is unordered
const Component2 = styled.div`
	top: 0;
	z-index: 2;
	${props => props.great && 'color: red'};
	display: block;
	position: absolute;
`;

// Both groups are unordered
const Component3 = styled.div`
	z-index: 2;
	top: 0;
	${props => props.great && 'color: red'};
	display: block;
	position: absolute;
`;

// Interpolation at the top
const Component4 = styled.div`
	${props => props.great && 'color: red'}
	top: 0;
	position: absolute;
`;

// Interpolation at the bottom
const Component5 = styled.div`
	top: 0;
	position: absolute;
	${props => props.great && 'color: red'}
`;

// Three groups
const Component6 = styled.div`
	top: 0;
	z-index: 2;
	${props => props.great && 'color: red'}
	display: block;
	position: absolute;
	${props => props.great && 'color: blue'}
	display: block;
	top: 0;
`;
