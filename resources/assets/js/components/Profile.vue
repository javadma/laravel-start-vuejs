<style>
    .widget-user-header {
        background-position: center center;
        -webkit-background-size: conver;
        background-size: conver;
        height: 250px;
    }
</style>
<template>
    <div class="container">
        <div class="box box-widget widget-user mt-3">
            <!-- Add the bg color to the header using any of the bg-* classes -->
            <div class="widget-user-header bg-black" style="background: url('/img/user-cover.jpg') center center;">
                <h3 class="widget-user-username">Elizabeth Pierce</h3>
                <h5 class="widget-user-desc">Web Designer</h5>
            </div>
            <div class="widget-user-image">
                <img class="img-circle" src="/img/user3-128x128.jpg" alt="User Avatar">
            </div>

        </div>
        <!-- tab -->

        <div class="row">
            <div class="col-md-12 mt-3">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a class="nav-link" href="#activity" data-toggle="tab">Activity</a>
                            </li>
                            <li class="nav-item"><a class="nav-link active show" href="#settings" data-toggle="tab">Settings</a>
                            </li>
                        </ul>
                    </div><!-- /.card-header -->
                    <div class="card-body">
                        <div class="tab-content">
                            <!-- Activity Tab -->
                            <div class="tab-pane" id="activity">
                                <h3 class="text-center">Display User Activity</h3>
                            </div>
                            <!-- Setting Tab -->
                            <div class="tab-pane active show" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="inputName" class="col-sm-2 control-label">Name</label>

                                        <div class="col-sm-12">
                                            <input type="text" v-model="form.name" class="form-control" id="inputName"
                                                   placeholder="Name">
                                            <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail" class="col-sm-2 control-label">Email</label>

                                        <div class="col-sm-12">
                                            <input v-model="form.email" type="email" class="form-control"
                                                   id="inputEmail"
                                                   placeholder="Email">
                                            <has-error :form="form" field="email"></has-error>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="inputExperience" class="col-sm-2 control-label">Experience</label>

                                        <div class="col-sm-12">
                                            <textarea v-model="form.bio" class="form-control" id="inputExperience"
                                                      placeholder="Experience"></textarea>
                                            <has-error :form="form" field="bio"></has-error>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-2 control-label">Profile Photo</label>
                                        <div class="col-sm-12">
                                            <input @change="updateProfile" type="file" name="photo" class="form-input">
                                        </div>

                                    </div>

                                    <div class="form-group">
                                        <label for="password" class="col-sm-12 control-label">Passport (leave empty if
                                            not changing)</label>

                                        <div class="col-sm-12">
                                            <input type="password"

                                                   class="form-control"
                                                   id="password"
                                                   placeholder="Passport"

                                            >
                                            <has-error :form="form" field="password"></has-error>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="col-sm-offset-2 col-sm-12">
                                            <button @click.prevent="updateInfo" type="submit" class="btn btn-success">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /.tab-pane -->
                        </div>
                        <!-- /.tab-content -->
                    </div><!-- /.card-body -->
                </div>
                <!-- /.nav-tabs-custom -->
            </div>
        </div>
        <!-- end tabs -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    bio: '',
                    photo: '',
                    password: ''
                })
            }
        },
        methods: {
            updateInfo() {
                this.$Progress.start();
                this.form.put('/api/profile')
                    .then(() => {
                        this.$Progress.finish();
                    })
                    .catch(() => {
                        this.$Progress.fail();
                    })
            },
            updateProfile(e) {
                let file = e.target.files[0];
                console.log(file['size']);
                let reader = new FileReader();
                if (file['size'] < 2111775) {
                    reader.onloadend = function (file) {
                        this.form.photo = reader.result;
                    };
                    reader.readAsDataURL(file);
                }else {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'You are uploading a large file',
                    });
                }
            },
        },
        mounted() {
            console.log('Profile Component mounted.')
        },
        created() {
            axios.get('/api/profile').then(({data}) => this.form.fill(data));
        }
    }
</script>
