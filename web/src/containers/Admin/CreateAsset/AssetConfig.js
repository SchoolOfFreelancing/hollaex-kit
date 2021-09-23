import React, { Fragment, useState } from 'react';
import { Input, InputNumber, Button, Form, Checkbox, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import Coins from '../Coins';
import ColorPicker from '../ColorPicker';
import { /*  getCoinInfo, */ storeAsset } from '../AdminFinancials/action';

const CONTACT_DESCRIPTION_LINK =
	'https://metamask.zendesk.com/hc/en-us/articles/360015488811-What-is-a-Token-Contract-Address-';

const { Search, TextArea } = Input;

// const radioStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     height: '30px',
//     lineHeight: '1.2',
//     padding: '24px 0',
//     margin: 0,
//     paddingLeft: '1px',
//     whiteSpace: 'normal',
//     letterSpacing: '-0.15px',
// };

const AssetConfig = (props) => {
	const [isSupply, setIsApply] = useState(false);
	const [form] = Form.useForm();
	const {
		coinFormData = {},
		handleChange,
		handleCheckChange,
		handleFileChange,
		handleMetaChange,
		handleNext,
		handleBack,
		isConfigureEdit,
		isEdit,
	} = props;
	const isBlockchainSearch =
		coinFormData.type === 'blockchain' &&
		(coinFormData.network === 'eth' || coinFormData.network === 'bnb');

	const handleSubmit = (values) => {
		if (values) {
			if (!props.isEdit && !props.isConfigureEdit) {
				updateAsset();
			} else {
				handleNext();
			}
		}
	};

	const updateAsset = async () => {
		const body = {
			...props.coinFormData,
		};
		if (!body.estimated_price) {
			body.estimated_price = 1;
		}
		if (!body.standard) {
			body.standard = '';
		}
		if (!body.network) {
			body.network = '';
		}
		if (!body.logo) {
			body.logo = '';
		}
		if (body.type === 'blockchain' && body.network === 'eth' && !isSupply) {
			delete body.meta.supply;
		}
		if (body.decimals) {
			body.decimals = parseInt(body.decimals, 10);
		}
		try {
			// const res = {};
			const res = await storeAsset(body);
			// if (props.getCoins) {
			//     await props.getCoins();
			// }
			if (res && res.data) {
				handleNext();
			}
		} catch (error) {
			if (error && error.data) {
				message.error(error.data.message);
			}
		}
	};

	// const handleChangeSupply = (e) => {
	//     if (e.target.value === 'limited') {
	//         props.handleMetaChange(0, 'supply');
	//     } else {
	//         props.handleMetaChange(e.target.value, 'supply');
	//     }
	// };

	const handleSearch = async (address) => {
		const {
			handleBulkUpdate,
			handleMetaChange,
			// coinFormData
		} = props;
		// const params = {
		//     address,
		//     network: coinFormData.network
		// }
		try {
			// const res = await getCoinInfo(params);
			const res = {};
			if (res.data) {
				const data = {
					...res.data,
					fullname: res.data.name,
					symbol: res.data.symbol.toLowerCase(),
				};
				if (res.data && res.data.supply) {
					setIsApply(true);
				} else {
					setIsApply(false);
				}
				handleBulkUpdate(data);
				handleMetaChange(address, 'contract');
			}
		} catch (error) {
			if (error.data && error.data.message) {
				message.error(error.data.message);
			} else {
				message.error(error.message);
			}
		}
	};

	const checkCoin = (rule, value, callback) => {
		let coinData = props.coins.map((coin) => {
			return coin.symbol;
		});
		if (coinData.includes(value)) {
			callback('This Asset symbol is already exist');
		} else {
			callback();
		}
	};

	const checkLower = (rule, value, callback) => {
		if (/[A-Z]/g.test(value)) {
			callback('Asset symbol must be in Lower case');
		} else {
			callback();
		}
	};
	const renderFields = () => {
		const { coinFormData = {}, handleChange } = props;

		if (
			coinFormData.type === 'blockchain' &&
			(coinFormData.network === 'eth' || coinFormData.network === 'bnb')
		) {
			return (
				<div className="md-field-wrap-search">
					<div className="sub-title">
						Contract(
						<a href={CONTACT_DESCRIPTION_LINK}>
							<span className="link">what's this?</span>
						</a>
						)
					</div>
					<Form.Item
						name="contract"
						rules={[
							{
								required: true,
								message: 'This field is required!',
							},
						]}
					>
						<Search
							enterButton="Search"
							onChange={handleChange}
							onSearch={handleSearch}
							value={coinFormData.contract}
						/>
					</Form.Item>
				</div>
			);
		} else if (
			coinFormData.type === 'blockchain' &&
			coinFormData.network !== 'eth'
		) {
			return (
				<div className="md-field-wrap-search">
					{coinFormData.network === 'other' ? (
						<div>
							<div className="sub-title">Blockchain name</div>
							<Form.Item
								name="blockchainName"
								rules={[
									{
										required: true,
										message: 'This field is required!',
									},
								]}
							>
								<Input onChange={(e) => 'a'} />
							</Form.Item>
						</div>
					) : null}
					<div className="sub-title">
						Contract(
						<a href={CONTACT_DESCRIPTION_LINK}>
							<span className="link">what's this?</span>
						</a>
						)
					</div>
					<Form.Item
						name="contract"
						rules={[
							{
								required: true,
								message: 'This field is required!',
							},
						]}
					>
						<Input
							enterButton="Search"
							onChange={handleChange}
							onSearch={handleSearch}
							value={coinFormData.contract}
						/>
					</Form.Item>
				</div>
			);
		}
	};

	return (
		<Fragment>
			<div className="title">Create or add a new coin</div>
			<Form
				form={form}
				initialValues={coinFormData}
				name="AssetConfigForm"
				onFinish={handleSubmit}
			>
				<div className="section-wrapper">
					{renderFields()}
					<div className="sub-title">Naming and color</div>
					<div className="color-wrapper">
						<Coins
							nohover
							large
							small
							type={(coinFormData.symbol || '').toLowerCase()}
							fullname={coinFormData.fullname}
							color={coinFormData.meta ? coinFormData.meta.color : ''}
						/>
						<div>
							<div className="md-field-wrap">
								{isBlockchainSearch ? (
									<Fragment>
										<div>
											<span className="sub-title">Asset name</span>
										</div>
										<span className="field-description">
											{coinFormData.fullname}
										</span>
									</Fragment>
								) : (
									<Fragment>
										<div>
											<span className="sub-title">Asset name</span>{' '}
											<span>(required)</span>
										</div>
										<span className="field-description">
											Enter the full name for this asset (example 'Bitcoin')
										</span>
										<Form.Item
											name="fullname"
											rules={[
												{
													required: true,
													message: 'This field is required!',
												},
											]}
										>
											<Input
												name="fullname"
												placeholder="Enter long form name"
												onChange={handleChange}
											/>
										</Form.Item>
									</Fragment>
								)}
							</div>
							<div className="md-field-wrap">
								{isBlockchainSearch ? (
									<Fragment>
										<div>
											<span className="sub-title">Asset symbol</span>
										</div>
										<span className="field-description">
											{coinFormData.symbol}
										</span>
									</Fragment>
								) : (
									<Fragment>
										<div>
											<span className="sub-title">Asset symbol</span>{' '}
											<span>(required)</span>
										</div>
										<span className="field-description">
											Enter the shorthand symbol for this asset (example 'BTC')
										</span>
										<Form.Item
											name="symbol"
											rules={[
												{
													required: true,
													message: 'This field is required!',
												},
												{
													max: 5,
													message: 'Symbol must be maximum 5 characters.',
												},
												{
													min: 2,
													message: 'Symbol must be minimum 2 characters.',
												},
												{
													validator: checkLower,
												},
												{
													validator:
														!isConfigureEdit && !isEdit ? checkCoin : null,
												},
											]}
										>
											<Input
												name="symbol"
												placeholder="Enter short hand name"
												onChange={handleChange}
											/>
										</Form.Item>
									</Fragment>
								)}
							</div>
							<div>
								<span className="sub-title">Color</span>{' '}
								<span>(for exchange purposes):</span>
							</div>
							<ColorPicker
								value={coinFormData.meta ? coinFormData.meta.color : ''}
								onChange={(val) => handleMetaChange(val, 'color')}
							/>
						</div>
					</div>
				</div>
				<div className="section-wrapper">
					<div className="sub-title">About</div>
					<div className="about-wrapper">
						<div className="md-field-wrap">
							<div className="sub-title">Description</div>
							<div>Write a short description of this asset</div>
							<TextArea
								placeholder="Input a message"
								name="message"
								rows={3}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
				<div className="section-wrapper">
					<div className="sub-title">Icon</div>
					<div className="d-flex align-items-center">
						<div className="md-field-wrap">
							{coinFormData.logo ? (
								<img
									src={coinFormData.logo || ''}
									alt="coin"
									className="preview-icon"
								/>
							) : (
								<div className="icon-upload">
									<div className="file-container">
										<label>
											<UploadOutlined
												style={{
													fontSize: '94px',
													color: '#808080',
													marginRight: '8px',
												}}
											/>
											<input
												type="file"
												onChange={(e) => handleFileChange(e, 'logo')}
												name="logo"
											/>
										</label>
									</div>
								</div>
							)}
						</div>
						<div className="md-field-wrap">
							<div>
								<span className="sub-title">Upload asset icon</span>{' '}
								<span>
									(this icon will be used in various places on your exchange):
								</span>
							</div>
							<div className="file-container">
								<label>
									<span>+ Upload ICON 75x75px</span>
									<input
										type="file"
										onChange={(e) => handleFileChange(e, 'logo')}
										name="logo"
										accept="image/jpg, image/jpeg, image/png"
									/>
								</label>
							</div>
						</div>
					</div>
				</div>
				<div className="section-wrapper">
					<div className="sub-title">Decimal points</div>
					<div className="d-flex align-items-center">
						<div className="preview-icon"></div>
						<div className="md-field-wrap">
							{isBlockchainSearch ? (
								<Fragment>
									<div>
										<span className="sub-title">Decimal points</span>
										<div>{coinFormData.meta.decimal_points}</div>
									</div>
								</Fragment>
							) : (
								<Fragment>
									<div>
										<span className="sub-title">Decimal points</span>{' '}
										<span>(max 18):</span>
									</div>
									<InputNumber
										name="decimal_points"
										min={0}
										max={18}
										onChange={(val) => handleMetaChange(val, 'decimal_points')}
										value={coinFormData.meta.decimal_points}
									/>
								</Fragment>
							)}
						</div>
					</div>
				</div>
				{/* {((isBlockchainSearch && isSupply) || !isBlockchainSearch)
                    ?
                    <div className="section-wrapper last">
                        <div className="sub-title">Supply</div>
                        <div className="d-flex align-items-center">
                            <div className="preview-icon"></div>
                            <div className="md-field-wrap">
                                {isBlockchainSearch
                                    ? <Fragment>
                                        <div>
                                            <span className="sub-title">Supply</span>
                                            <div>{coinFormData.meta.supply}</div>
                                        </div>
                                    </Fragment>
                                    :
                                    <Radio.Group
                                        name="supply"
                                        onChange={handleChangeSupply}
                                        value={coinFormData.meta.supply === 'other'
                                            ? 'other'
                                            : 'limited'
                                        }
                                    >
                                        <Radio style={radioStyle} value={'limited'}>
                                            Limited supply
                                        </Radio>
                                        {coinFormData.meta.supply !== 'other'
                                            ? <div>
                                                <div>
                                                    <span className="sub-title">Supply</span>
                                                </div>
                                                {isBlockchainSearch
                                                    ? <div>{coinFormData.meta.supply}</div>
                                                    : <InputNumber
                                                        name="supply"
                                                        min={0}
                                                        onChange={(val) => handleMetaChange(val, 'supply')}
                                                        value={coinFormData.meta.supply}
                                                    />
                                                }
                                            </div>
                                            : null
                                        }
                                        <Radio style={radioStyle} value={'other'}>
                                            Other
                                        </Radio>
                                    </Radio.Group>
                                }
                            </div>
                        </div>
                    </div>
                    : null
                } */}
				<div className="section-wrapper last">
					<div className="sub-title">Make public</div>
					<div className="md-field-wrap">
						<div>
							Make this asset public so that others can see and add this asset
							to their platform.
						</div>
						<Checkbox
							name="is_public"
							onChange={handleCheckChange}
							className="sub-title"
							checked={coinFormData.is_public}
						>
							Make Public
						</Checkbox>
					</div>
				</div>
				<div className="btn-wrapper">
					<Button type="primary" className="green-btn" onClick={handleBack}>
						Back
					</Button>
					<div className="separator"></div>
					<Button type="primary" className="green-btn" htmlType="submit">
						Next
					</Button>
				</div>
			</Form>
		</Fragment>
	);
};

export default AssetConfig;