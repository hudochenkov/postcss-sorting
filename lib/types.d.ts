import type { AtRule, ChildNode, Comment, Declaration, Root, Rule } from 'postcss';

// Plugin options

export type OrderKeyword =
	| 'custom-properties'
	| 'dollar-variables'
	| 'at-variables'
	| 'declarations'
	| 'rules'
	| 'at-rules';

export type AtRuleOrderOption = {
	type: 'at-rule';
	name?: string;
	parameter?: string | RegExp;
	hasBlock?: boolean;
};

export type RuleOrderOption = {
	type: 'rule';
	selector?: string | RegExp;
};

export type OrderOptionItem = OrderKeyword | AtRuleOrderOption | RuleOrderOption;

export type PropertiesOrderOption = 'alphabetical' | string[];

export type UnspecifiedPropertiesPositionOption = 'top' | 'bottom' | 'bottomAlphabetical';

export type PluginOptions = {
	order?: OrderOptionItem[];
	'properties-order'?: PropertiesOrderOption;
	'unspecified-properties-position'?: UnspecifiedPropertiesPositionOption;
	'throw-validate-errors'?: boolean;
};

// PostCSS nodes

type SortingFields = {
	position: number;
	initialIndex: number;
};

/** postcss-less sets `variable` on at-variables like `@var: value` */
type LessAtRule = AtRule & {
	variable?: boolean;
};

/** `position` and `initialIndex` are assigned during sorting */
export type SortableChildNode = (Comment | Declaration | Rule | LessAtRule) &
	Partial<SortingFields>;

export type IndexedChildNode = ChildNode & SortingFields;

export type IndexedComment = Comment & SortingFields;

/** Nodes that have children */
export type ContainerNode = AtRule | Rule | Root;

// `order` option as normalized by `createExpectedOrder` (user input is `OrderOptionItem`)

export type PositionData = {
	position: number;
};

export type RulePattern = PositionData & {
	selector?: RegExp;
};

export type AtRulePattern = PositionData & {
	name?: string;
	parameter?: RegExp;
	hasBlock?: boolean;
};

export type ExpectedOrder = {
	'custom-properties'?: PositionData;
	'dollar-variables'?: PositionData;
	'at-variables'?: PositionData;
	declarations?: PositionData;
	rule?: RulePattern[];
	'at-rule'?: AtRulePattern[];
};

/** Rule properties matched against `RulePattern` */
export type RuleTarget = {
	selector: string;
};

/** At-rule properties matched against `AtRulePattern` */
export type AtRuleTarget = {
	name: string;
	hasBlock: boolean;
	parameter?: string;
};

// Properties order

export type PropertyOrderData = {
	propertyIndex: number;
};

export type ExpectedPropertiesOrder = Record<string, PropertyOrderData>;

type PropertyDataBase = {
	unprefixedName: string;
	orderData: PropertyOrderData | undefined;
	initialIndex: number;
	unspecifiedPropertiesPosition: UnspecifiedPropertiesPositionOption;
};

export type DeclarationData = PropertyDataBase & {
	name: string;
	node: Declaration;
};

/** Comment attached to a declaration, shares the declaration's sorting data */
export type CommentData = PropertyDataBase & {
	node: Comment;
};

export type PropertyData = DeclarationData | CommentData;
