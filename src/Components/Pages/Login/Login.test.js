import { shallow, mount } from 'enzyme';
import Login from './Login';

describe('<Login />', () => {
  const container = shallow(<Login />);
  it('txtEmail field should be existed', () => {
    expect(container.find('#txtEmail').length).toEqual(1);
  });
  it('txtEmail field should have proper props', () => {
    expect(container.find('#txtEmail').props()).toEqual({
      id: "txtEmail",
      onChange: expect.any(Function),
      type: 'email',
      value: "",
      disabled: false,
      required: true
    });
  });
  it('txtPassword field should be existed', () => {
    expect(container.find('#txtPassword').length).toEqual(1);
  });
  it('txtPassword field should have proper props', () => {
    expect(container.find('#txtPassword').prop('type')).toEqual('password');
    expect(container.find('#txtPassword').prop('value')).toEqual('');
    expect(container.find('#txtPassword').prop('disabled')).toBeFalsy();
    expect(container.find('#txtPassword').prop('required')).toBeTruthy();
    expect(container.find('#txtPassword').prop('onChange')).toEqual(expect.any(Function));
  });
  it('btnLogin field should be existed', () => {
    expect(container.find('#btnLogin').length).toEqual(1);
  });

  it('should set the txtEmail value on change event', () => {
    container.find('#txtEmail').prop('onChange')({
      target:{
        value: 'thant@gmail.com'
      }
    });
    expect(container.find('#txtEmail').prop('value')).toEqual(
      'thant@gmail.com',
    );
  });

  it('should set the txtPassword value on change event', () => {
    container.find('#txtPassword').prop('onChange')({
      target:{
        value: 'thant001'
      }
    });
    expect(container.find('#txtPassword').prop('value')).toEqual(
      'thant001',
    );
  });

  it('should not process logginIn when set invalid email format value and click btnLogin', () => {
    container.find('#txtEmail').prop('onChange')({
      target:{
        value: 'dioidjxs'
      }
    });
    container.find('#txtPassword').prop('onChange')({
      target:{
        value: 'thant001'
      }
    });
    container.find('#btnLogin').simulate('click');
    expect(container.find('#btnLogin').prop('children')).toEqual('Log in');
    expect(container.find('#btnLogin').prop('disabled')).toBeFalsy();
  });
});